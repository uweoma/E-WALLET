const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;


const transactionSchema = new mongoose.Schema({
    walletId: { 
        type: ObjectId, 
        ref: "Wallet" 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['ADD', 'TRANSFER', 'RECEIVE'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'SUCCESS', 'FAILED'], 
        default: 'SUCCESS' 
    },
    transactionId: { 
        type: String, 
    },
}, { timestamps: true });