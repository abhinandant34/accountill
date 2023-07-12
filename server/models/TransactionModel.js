import mongoose from 'mongoose'

const TransactionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true
    },
    type: {
        type: String,
        required: true,
        maxLength: 20,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true,
        set: function(date) {
            // Convert the date format from "yyyy-mm-dd" to a Date object
            return new Date(date);
        }
    },
    description: {
        type: String,
        required: true,
        maxLength: 20,
        trim: true
    }
})

const TransactionModel = mongoose.model('TransactionModel', TransactionSchema)
export default TransactionModel