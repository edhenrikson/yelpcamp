const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {places, descriptors} = require('./seedHelpers');
const cities = require('./cities');

const path = require('path');
const Campground = require('../models/campground');
const { Logger } = require('mongodb');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '5fe4b4ab99eb0877c2046eb3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type : "Point", 
                coordinates : [ cities[random1000].longitude,
                                 cities[random1000].latitude] 
            },

            images:[
            { 
            
                url : "https://res.cloudinary.com/dsilj1jhg/image/upload/v1609003866/YelpCamp/ic0ylkedxyn095jajtfr.jpg", 
                filename : "YelpCamp/ic0ylkedxyn095jajtfr" 
            } 
            ],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod commodi dolores nostrum pariatur libero ex in ipsam veritatis sequi esse minus nobis consequuntur aliquam incidunt, optio molestiae deserunt neque saepe.",
            price
        })
        await camp.save()
    }
}

seedDB().then( () =>
    mongoose.connection.close()
)