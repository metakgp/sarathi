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

router.get('/unread_notif_count', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('notifications').exec()
    .then(user => {
        var count = user.notifications.filter(item => !item.read).length;
        res.status(200).send(count + "");
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});

router.get('/groups_count', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('created_groups')
    .populate('joined_groups').exec()
    .then(user => {
        res.status(200).send((user.created_groups.length + user.joined_groups.length) + "");
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});

router.get('/requests_count', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).populate('sent_requests').populate('received_requests').exec()
    .then(user => {
        res.status(200).send((user.sent_requests.length + user.received_requests.length) + "");
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});

router.get('/get_link', (req, res) => {
    models.User.findOne({fb_id: req.user.fb_id}).exec()
    .then(user => {
        res.status(200).send(user.profile);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
})

router.post('/set_link', (req, res) => {
    models.User.findOneAndUpdate({fb_id: req.user.fb_id}, {profile: req.body.link}).exec()
    .then(() => res.sendStatus(200))
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
})

module.exports = router;