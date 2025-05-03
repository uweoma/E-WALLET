const mongoose = require('mongoose');
//const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;


// The walletSchema is then exported as a Mongoose model named "Wallet".
// The model can be used to interact with the Wallet collection in the MongoDB database.
// The Wallet model is used to manage user wallets in the application.

const walletSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    balance: { 
        type: Number, 
        default: 0 
    },
}, 
    { 
        timestamps: true 
    }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;



