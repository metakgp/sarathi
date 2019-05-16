const router = require('express').Router();
const models = require('../models/index').models;

router.get('/', (req, res) => {
    res.send({name: req.user.name, profile: req.user.profile}); 
});

router.get('/my_groups', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('created_groups')
    .populate('joined_groups')
    .exec((err, user) => {
        if (err)
            res.send(err);
        const result = {
            created: user.created_groups,
            joined: user.joined_groups,
        };
        res.send(result);
    });
});

router.get('/my_requests', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('sent_requests')
    .populate('received_requests')
    .exec((err, user) => {
        if (err)
            res.send(err);
        const result = {
            sent: user.sent_requests,
            received: user.received_requests,
        }
        res.send(result);
    });
});

module.exports = router;