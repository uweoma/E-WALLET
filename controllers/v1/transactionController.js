const Wallet = require('../../models/Wallet');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @desc   Trasaction
// @route  POST /api/v1/transaction
// @access Private
// const transaction = async (req, res) => {
//     try {
//         const { amount, type } = req.body;
//         const userId = req.user.id;

//         if (!amount || typeof amount !== 'number' || amount <= 0) {
//             return res.status(400).json({ message: 'Invalid amount' });
//         }

//         if (type !== 'ADD' && type !== 'WITHDRAW') {
//             return res.status(400).json({ message: 'Invalid transaction type' });
//         }

//         const wallet = await Wallet.findOne({ userId });

//         if (!wallet) {
//             return res.status(404).json({ message: 'Wallet not found' });
//         }

//         // Update wallet balance
//         if (type === 'ADD') {
//             wallet.balance += amount;
//         } else if (type === 'WITHDRAW') {
//             if (wallet.balance < amount) {
//                 return res.status(400).json({ message: 'Insufficient funds' });
//             }
//             wallet.balance -= amount;
//         }

//         await wallet.save();

//         // Create transaction record
//         const transaction = new Transaction({
//             userId,
//             type,
//             amount,
//             status: 'SUCCESS',
//             transactionId: uuidv4(),
//         });

//         await transaction.save();

//         res.status(200).json({
//             message: 'Transaction successful',
//             balance: wallet.balance,
//             transactionId: transaction.transactionId,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// @desc    Get transaction history
// @route   GET /api/v1/transaction/
// @access  Private
const getTransactionHistory = async (req, res) => {
    try {
        //const userId = req.user.id;

        const wallet = await Wallet.findOne({ userId: req.user })

        const transactions = await Transaction.find({ walletId: wallet._id }).sort({ createdAt: -1 });

        if (!transactions) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactionHistory,   
}


