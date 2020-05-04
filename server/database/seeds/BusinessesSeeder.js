const faker = require('faker');
faker.locale = 'es';

const mongoose = require('mongoose');
const Model = mongoose.model('Business');
const DOCUMENTS = 10;

var getData = () => {
    let data = [];
    let startNumber = ['9', '6'];
    let names = ['Organizador de eventos', 'Conciertos', 'Fiestas'];
    let businessSuffix = ['S.L.', 'S.A.'];
    let addressSuffixes = ['Avenida', 'Calle', 'Plaza', 'Vía', 'Polígono'];

    for (let i = 0; i < DOCUMENTS; i++) {
        let city = faker.address.city(1);
        let address = faker.random.arrayElement(addressSuffixes)+' '+faker.name.lastName()+' '+faker.random.number({min: 1, max: 199})+', '+city;
        data.push({
            name: faker.random.arrayElement(names)+' '+faker.name.lastName()+' '+faker.random.arrayElement(businessSuffix),
            address: address,
            city: city,
            zipcode: faker.address.zipCode(),
            phone: faker.random.arrayElement(startNumber)+faker.helpers.replaceSymbolWithNumber('########'),
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