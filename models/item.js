  // TODO: CONFIRM ITEMS ARE STORED IN THE DATABASE
  
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const itemSchema = new Schema({
      title: {type: String, required: [true, 'title is required']},
      seller: {type: Schema.Types.ObjectId, ref: 'User'},
      condition: {type: String, required: [true, 'condition is required'],
                enum: ["New", "Mint", "Used", "Fine", "Poor", 'must be a valid condition']},
      medium: {type: String, required: [true, 'medium is required'],
                enum: ["DVD", "VHS", "Lazer-Disk", 'must be a valid medium']},   
      price: {type: Number , required: [true, 'price is required'],
                minimum: [0.01, 'minimum price is 0.01']},
      details: {type: String, required: [true, 'details is required'],
                minLength: [10, 'the details should have at least 10 characters']},
      image: {type: String, required: [true, 'image is required']},
      totalOffers: {type: Number, default: 0,
                minimum: [0, 'minimum value is 0']},
      active: {type: Boolean, default: true},
      highestOffer: {type: Number, default: 0},
    });

    module.exports = mongoose.model('Item', itemSchema);