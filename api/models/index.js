/*
    Provides models for mongo db
*/
const mongoose = require('mongoose');

// import  models
const User = require('./user');
const Travel = require('./travel');
const Group = require('./group');

const models = { User, Travel, Group };

module.exports = {
    models: models,
};
