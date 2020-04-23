const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
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
 * Función para hashear texto
 * @param {string} strPwd El texto a hashear
 * @return {string} El hash de strPwd
 */
UserSchema.statics.hashPassword = function(strPwd) {
    return crypto.createHash('sha256').update(strPwd).digest('hex');
}

UserSchema.virtual('url')
          .get(function() {
              return '/users/' + this._id;
          });

// Exportar modelo
module.exports = mongoose.model('User', UserSchema);