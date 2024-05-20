const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Ask TA if the first half of schema is correct (refer to part 1)
const offerSchema = new Schema({
        user:{type: Schema.Types.ObjectId, ref: 'User'},
        item:{type: Schema.Types.ObjectId, ref: 'Item'},
        amount: {type: Number, required: [true, 'amount is required'],
                min: [0.01, 'minimum price is 0.01']},
        status: {type: String, required: [true, 'status is required'],
                enum: ["Pending", "Rejected", "Accepted", 'must be a valid status'],
                default: 'Pending'},
});

module.exports = mongoose.model('Offer', offerSchema);