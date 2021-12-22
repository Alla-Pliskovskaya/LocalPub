let Waiter = require('../models/waiter');

exports.waiter_list = function(req, res, next)
{
    Waiter.find({})
        .exec(function (err, list_waiters) {
            if (err) { return next(err); }
            res.render('waiter_list', { title: 'Waiter List', waiter_list: list_waiters});
        });
};
