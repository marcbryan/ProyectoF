const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
var moment = require('moment');

var UserSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    city: {type: String, required: true},
    zipcode: {type: String, required: true},
    phone: {type: String, required: true},
    profileImg_URL: String,
    credit_card: Map,
    tickets: Array,
    friends: Array,
    google_token: String,
    fb_token: String
}, {
    // Añade el timestamp createdAt y no añade updatedAt
    timestamps: { createdAt: true, updatedAt: false }
});


/**
 * TODO: Añadir comentario función
 */
UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    obj.createdAt = this.str_createdAt;
    delete obj._id;
    delete obj.password;
    return obj;
}
   

/**
 * Función estática para hashear texto
 * @param {string} strPwd El texto a hashear
 * @return {string} El hash de strPwd
 */
UserSchema.statics.hashPassword = function(strPwd) {
    return crypto.createHash('sha256').update(strPwd).digest('hex');
}

// TODO: Añadir comentario
UserSchema.virtual('str_createdAt')
    .get(function() {
        return moment(this.createdAt).format('DD/MM/YYYY HH:mm:ss');
    });

// Exportar modelo
module.exports = mongoose.model('User', UserSchema);