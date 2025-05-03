const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Wallet = require('../../models/Wallet');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        
        if (typeof name !== 'string') {
            return res.status(400).json({ message: 'Name must be a string' });
        }

        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Email must be a string' });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        //const hashedPassword = await bcrypt.hash(password, 10); don't hash password here, it will be hashed in the model pre-save hook
        const user = await User.create({
            name,
            email,
            password
        });

        const wallet = await Wallet.create({
            userId: user._id,
            balance: 0,
        });
        if (!wallet) {
            return res.status(500).json({ message: 'Failed to create wallet' });
        }

        // link wallet to user
        user.walletId = wallet._id;
        await user.save();

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            walletId: user.walletId,

            createdAt: user.createdAt,
        });
        return;

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        let { email, password } = req.body;


        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Email must be a string' });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        //Find user with this email
        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        
        

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid passworddd' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
        };
        // Create JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Send user data in response
        res.status(200).json({
            token,
            user: {
                userId: user._id,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.find({});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const walletId = await Wallet.find({userId: user._id});
        if (!walletId) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        

        res.status(200).json(user, walletId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.user.id;
        if (typeof userId !== 'string') {
            return res.status(400).json({ message: 'User ID must be a string' });
        }

        if (typeof name !== 'string') {
            return res.status(400).json({ message: 'Name must be a string' });
        }

        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Email must be a string' });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        const user = await User.findByIdAndUpdate(req.para.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
}