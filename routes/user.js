const router = require('express').Router();
const models = require('../models/index').models;

router.get('/', (req, res) => {
    res.send({name: req.user.name, profile: req.user.profile}); 
});

router.get('/groups', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('created_groups')
    .populate('joined_groups')
    .exec((err, user) => {
        if (err)
            res.send(err);
        else {
            const result = {
                created: user.created_groups,
                joined: user.joined_groups,
            };
            res.send(result);
        }
    });
});

router.get('/requests', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id})
    .populate({
        path: 'sent_requests',
        populate: {
            path: 'group',
        },
    })
    .populate({
        path: 'received_requests',
        populate: {
            path: 'group',
        }
    })
    .exec((err, user) => {
        if (err)
            res.send(err);
        else {
            const result = {
                sent: user.sent_requests,
                received: user.received_requests,
            }
            res.send(result);
        }   
    });
});

router.get('/notifications', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('notifications')
    .exec((err, user) => {
        if (err)
            res.send(err);
        else
            res.send(user.notifications);
    });
});

module.exports = router;