const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var BusinessSchema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    zipcode: {type: String, required: true},
    phone: {type: String, required: true},
    img_url: {type: String, default: 'default'}
}, {
    timestamps: { createdAt: true, updatedAt: false }
});


module.exports = mongoose.model('Business', BusinessSchema);