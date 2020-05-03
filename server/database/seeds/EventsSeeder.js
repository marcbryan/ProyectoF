const faker = require('faker');
faker.locale = 'es';

var moment = require('moment');
const mongoose = require('mongoose');
const Model = mongoose.model('Event');
const DOCUMENTS = 20;

var getData = () => {
    let data = [];
    let names = ['Concierto', 'Fiesta', 'Gran evento'];
    let hours = [21, 22, 23, 0, 1];
    let minutes = [0, 15, 30, 45];
    let addressSuffixes = ['Avenida', 'Calle', 'Plaza', 'Vía', 'Polígono'];

    for (let i = 0; i < DOCUMENTS; i++) {
        let city = faker.address.city(1);
        let location = faker.random.arrayElement(addressSuffixes)+' '+faker.name.lastName()+' '+faker.random.number({min: 1, max: 199})+', '+city;
        let name = faker.random.arrayElement(names)+' en '+city;
        let numTickets = faker.random.number({min: 100, max: 1000});
        // Generamos una fecha aleatoria entre hoy y dentro de 1 mes, le asignamos una hora y unos minutos aleatorios de los arrays
        let date = moment(moment(), moment().add(1, 'month'))
            .set({
                hour: faker.random.arrayElement(hours),
                minutes: faker.random.arrayElement(minutes),
                seconds: 0
            });
        
        data.push({
            name: name,
            description: faker.lorem.sentence(),
            price: faker.finance.amount(10, 30, 2),
            starts: date,
            // La fecha de fin será entre 2 y 5 horas después que la fecha de inicio
            ends: moment(date).add({hours: faker.random.number({min: 2, max: 5})}),
            location: location,
            ticketsForSale: numTickets,
            tickets_available: numTickets
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