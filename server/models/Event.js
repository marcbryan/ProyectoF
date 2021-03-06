const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var moment = require('moment');

var toInteger = v => Math.round(v);

var EventSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''},
    price: {type: Number, required: true},
    starts: {type: Date, required: true},
    ends: {type: Date, required: true},
    location: {type: String, required: true},
    ticketsForSale: {type: Number, required: true, get: toInteger, set: toInteger},
    tickets_available: {type: Number, required: true, get: toInteger, set: toInteger},
    img_url: {type: String, default: 'default'},
    business_id: String, 
    status: {type:Number, default: 1, get: toInteger, set: toInteger},
});

EventSchema.methods.toJSON = function() {
    var obj = this.toObject();
    obj.starts = this.str_starts;
    obj.ends = this.str_ends;
    obj.date = moment(this.starts).format('DD/MM/YYYY');
    obj.schedule = moment(this.starts).format('HH:mm')+' - '+moment(this.ends).format('HH:mm');
    return obj;
}

EventSchema.statics.formatDate = function(date) {
    return moment(new Date(date)).format('DD/MM/YYYY HH:mm');
}

EventSchema.virtual('str_starts')
    .get(function() {
        return moment(this.starts).format('DD/MM/YYYY HH:mm');
    });

EventSchema.virtual('str_ends')
    .get(function() {
        return moment(this.ends).format('DD/MM/YYYY HH:mm');
    });


module.exports = mongoose.model('Event', EventSchema);

