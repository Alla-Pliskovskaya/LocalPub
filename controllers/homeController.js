const async = require("async");
const Waiter = require("../models/waiter");
const Table = require("../models/table");

exports.index = function(req, res)
{
    async.parallel({
        waiter_count: function(callback) {
            Waiter.countDocuments({}, callback);
        },
        table_count: function(callback) {
            Table.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Pub Home', error: err, data: results });
    });
};