'use strict';
const faker = require('faker');
// Asignar idioma de faker
faker.locale = 'es';

const mongoose = require('mongoose');
const Model = mongoose.model('User');
const DOCUMENTS = 10;

var getData = () => {
    let data = [];
    let hash = Model.hashPassword('123456'); // Todos los usuarios creados por el seeder tendrán la misma contraseña
    let defaultImg = 'default_user_img.svg';    

    for (let i=0; i < DOCUMENTS; i++) {
        let firstName = faker.name.firstName();
        let lastName = faker.name.lastName();
        data.push({
            name: firstName,
            last_name: lastName,
            email: faker.internet.email(firstName, lastName).toLowerCase(),
            password: hash,
            city: faker.address.city(1),
            zipcode: faker.address.zipCode(),
            phone: '6'+faker.helpers.replaceSymbolWithNumber('########'),
            profileImg_URL: defaultImg,
            credit_card: {
                number: faker.helpers.replaceSymbolWithNumber('################'),
                expires: '12/'+faker.random.number({min:20, max:30}),
                ccv: faker.helpers.replaceSymbolWithNumber('###'),
                nameOnCard: firstName+' '+lastName
            },
            tickets: [],
            friends: [],
            createdAt: new Date()
        });
    }
    return data;
}

var seed = (callback) => {
    let data = getData();
    Model.create(data, (err, result) => {
        if (err) throw err;
        console.log("Seeding " + Model.modelName + " collection");
        callback();
    });
}

module.exports = seed;