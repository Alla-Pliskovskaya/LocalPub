let TimeTable = require('../models/time_table');
let Table = require('../models/table');
let Customer = require('../models/customer');

exports.time_table_list = function(req, res) {
    let lst = []
    Customer.find({}).exec(function(err, result) {
        if (err) { return next(err); }
        lst = result;
    })
    console.log(lst);

    TimeTable.find({})
        .populate('table')
        .populate('customer')
        .exec(function(err, list) {
            let possibleTime = [];

            for (let i = 12; i < 24; i++) {
                possibleTime.push(i);
            }

            Table.find({}, 'number capacity location')
                .sort({ number: 1 })
                .exec(function(err, list_tables) {
                    if (err) { return next(err); }
                    res.render('time_table', { time_table_list: list, tables: list_tables, times: possibleTime });
                });

            if (err) { return next(err); }
            //Successful, so render
        });
};

exports.time_table_reserve = function(req, res) {
    console.log(req.body);
    let time_from = Number(req.body.time_from);
    let time_to = Number(req.body.time_to);
    if (time_from === time_to || time_to < time_from) {
        res.send("Incorrect input");
        return;
    }
    TimeTable.find()
        .populate({
            path: 'table',
            match: {
                number: req.body.table_number
            }
        })
        .populate('customer')
        .exec(function (err, time_tables) {
            tables = time_tables.filter(function (time_table) {
                return time_table.table; // return only users with email matching 'type: "Gmail"' query
            });
            console.log(tables[0]);
            if (err) {
                res.send(err);
            } else {
                let desiredTime = [];

                for (let i = time_from; i < time_to; i++) {
                    desiredTime.push(i);
                }

                let reserved_time = [];
                console.log(desiredTime);

                tables.forEach(element => {
                    let start_hour = element.reservation_date_from.getHours();
                    let end_hour = element.reservation_date_to.getHours();

                    for (let i = start_hour; i < end_hour; i++) {
                        reserved_time.push(i);
                    }
                });
                console.log(reserved_time);

                let intersection = desiredTime.filter(x => reserved_time.includes(x));

                if (intersection.length === 0) {
                    let customer = new Customer({
                        first_name: req.body.client_name,
                        last_name: req.body.client_surname
                    })
                    customer.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        // Successful - redirect to new author record.
                        console.log('created customer')
                    });
                    console.log(customer);
                    let from = new Date();
                    from.setHours(time_from, 0, 0);
                    console.log(from);
                    let to = new Date();
                    to.setHours(time_to, 0, 0);
                    console.log(to);
                    let time_table = new TimeTable({
                        table: tables[0].table,
                        customer: customer,
                        reservation_date_from: from,
                        reservation_date_to: to,
                    });
                    time_table.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        console.log('created time_table')
                    })
                    console.log(time_table);
                    res.send('You have successfully reserved a table!');
                } else {
                    res.send('This time has already been taken. Choose a different time.');
                }
                console.log(intersection);
            }
        });
}