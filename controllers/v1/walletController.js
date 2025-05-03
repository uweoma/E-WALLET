const Wallet = require('../../models/Wallet');
const auth = require('../../middleware/auth')
const Transaction = require('../../models/Transaction')
const { v4: uuidv4 } = require('uuid');
const User = require('../../models/User');
const mongoose = require('mongoose');

// @desc    Get wallet balance
// @route   GET /api/v1/wallet/balance
// @access  Private
const getWalletBalance = async (req, res) => {
    try {
        //const userId = req.user.userId
        const userId = req.params.id;
        console.log(userId)
        if (!userId) 
            return res.status(401).json({ message: "Access Deniedddd" });
        
        const objectUserId = new mongoose.Types.ObjectId(userId);
        //const { userId } = req.params
        const wallet = await Wallet.findOne({ userId: userId });
        //const wallet = await Wallet.findOne({ userId: new mongoose.Types.ObjectId(req.user) });
        console.log(wallet)


        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.status(200).json({ balance: wallet.balance });
        console.log(wallet)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Add funds to wallet
// @route   POST /api/v1/wallet/add-funds
// @access  Private
const addFundsToWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Update wallet balance
        wallet.balance += amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'ADD',
            amount,
            transactionId: uuidv4(),
            status: 'SUCCESS',
        });

        // await Transaction.create({
        //     walletId: wallet._id,
        //     type: "ADD",
        //     amount,
        //     status: "SUCCESS",
        //     transactionId: uuidv4()
        //   });

        await transaction.save();

        res.status(200).json({ message: 'Funds added successfully', balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Withdraw funds from wallet
// @route   POST /api/v1/wallet/withdraw-funds
// @access  Private
const withdrawFundsFromWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Update wallet balance
        wallet.balance -= amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
            userId,
            type: 'debit',
            amount,
            transactionId: uuidv4(),
            status: 'completed',
        });

        await transaction.save();

        res.status(200).json({ message: 'Funds withdrawn successfully', balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get transaction history
// @route   GET /api/v1/wallet/transactions
// @access  Private
const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({ userId });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user wallet
// @route   GET /api/v1/wallet/user
// @access  Private

const getUserWallet = async (req, res) => {
    try {
        const userId = req.user.id;
        const wallet = await Wallet.findOne({ userId }).populate('userId', 'name email');

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Transfer funds to another user
// @route   POST /api/v1/wallet/transfer
// @access  Private
const transferFunds = async (req, res) => {
    try {
        const { amount, recipientEmail } = req.body;
        const senderId = req.user.id;

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const senderWallet = await Wallet.findOne({ userId: senderId });

        if (!senderWallet) {
            return res.status(404).json({ message: 'Sender wallet not found' });
        }

        if (senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        const recipient = await User.findOne({ email: recipientEmail });

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const recipientWallet = await Wallet.findOne({ userId: recipient._id });

        if (!recipientWallet) {
            return res.status(404).json({ message: 'Recipient wallet not found' });
        }

        // Update sender's wallet balance
        senderWallet.balance -= amount;
        await senderWallet.save();

        // Update recipient's wallet balance
        recipientWallet.balance += amount;
        await recipientWallet.save();

        // Create transaction record for sender
        const senderTransaction = new Transaction({
            walletId: senderId,
            type: 'TRANSFER',
            amount,
            transactionId: uuidv4(),
            status: 'SUCCESS',
            recipientId: recipient._id,
        });

        await senderTransaction.save();

        // Create transaction record for recipient
        const recipientTransaction = new Transaction({
            walletId: recipient._id,
            type: 'RECEIVE',
            amount,
            transactionId: uuidv4(),
            status: 'SUCCESS',
            senderId,
        });

        await recipientTransaction.save();

        res.status(200).json({ message: 'Funds transferred successfully', balance: senderWallet.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWalletBalance,
    addFundsToWallet,
    //withdrawFundsFromWallet,
    //getTransactionHistory,
    //getUserWallet,
    transferFunds,
};