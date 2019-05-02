const mongoose = require('mongoose');

// import  models
const User = require('./user');

//TODO: take database url from env file
const connectDb = (url, options) => {
    options['useNewUrlParser'] = true;
    return mongoose.connect(url, options);
};
const models = { User };

module.exports = {
    connect: connectDb,
    models: models,
};
