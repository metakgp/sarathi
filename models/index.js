
// import  models
const User = require('./user');
const Group = require('./group');
const Request = require('./request');
const Notification = require('./notification');

const models = { User, Group, Request, Notification };

module.exports = {
    models: models,
};
