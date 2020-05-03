const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
var moment = require('moment');

var BusinessUserSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    role: {type: String, required: true, default: 'user'},
    phone: {type: String, required: true},
    business_id: String,
    profileImg_URL: {type: String, default: 'default'},
    has2FA: {type: Boolean, default: false}
}, {
    // Añade el timestamp createdAt y no añade updatedAt
    timestamps: { createdAt: true, updatedAt: false }
});


/**
 * Convierte el timestamp createdAt en el formato DD/MM/YYYY HH:mm:ss y elimina id y password
 * al convertir el modelo en un objeto JSON al utilizar la función toJSON
 * @override
 */
BusinessUserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    obj.createdAt = this.str_createdAt;
    delete obj._id;
    delete obj.password;
    return obj;
}

/**
 * Función para hashear la contraseña, asigna al atributo password la contraseña hasheada
 */
BusinessUserSchema.methods.setPasswordAsHash = function() {
    this.password = crypto.createHash('sha256').update(this.password).digest('hex');
}
   

/**
 * Función estática para hashear texto
 * @param {string} strPwd El texto a hashear
 * @return {string} El hash de strPwd
 */
BusinessUserSchema.statics.hashPassword = function(strPwd) {
    return crypto.createHash('sha256').update(strPwd).digest('hex');
}

/** 
 * Convierte el timestamp createdAt del modelo
 * @return {string} La fecha en formato DD/MM/YYYY HH:mm:ss
 */
BusinessUserSchema.virtual('str_createdAt')
    .get(function() {
        return moment(this.createdAt).format('DD/MM/YYYY HH:mm:ss');
    });

// Exportar modelo
module.exports = mongoose.model('BusinessUser', BusinessUserSchema);