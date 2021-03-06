let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return;
}

let async = require('async');
let Waiter = require('./models/waiter');
let Table = require('./models/table');
let Customer = require('./models/customer');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let waiters = [];
let customers = [];
let tables = [];

function waiterCreate(first_name, last_name, date_of_birth, category, cb) {
    let waiter_detail = { first_name: first_name, last_name: last_name, category: category }
    if (date_of_birth !== false) waiter_detail.date_of_birth = date_of_birth;
    if (date_of_birth !== false) waiter_detail.date_of_death = date_of_birth;

    let waiter = new Waiter(waiter_detail);
    waiter.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Waiter: ' + waiter);
        waiters.push(waiter)
        cb(null, waiter)
    });
}

function customerCreate(first_name, last_name, cb) {
    let customer_detail = { first_name: first_name, last_name: last_name }

    let customer = new Customer(customer_detail);
    customer.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Customer: ' + customer);
        customers.push(customer)
        cb(null, customer)
    });
}

function tableCreate(number, capacity, waiter, location, cb) {
    let table_detail = {
        number: number,
        capacity: capacity,
        waiter: waiter,
        location: location
    }

    let table = new Table(table_detail);
    table.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New table: ' + table);
        tables.push(table);
        cb(null, table);
    });
}

function createWaiters(cb) {
    async.series([
            function(callback) {
                waiterCreate('Patrick', 'Peters', '1996-06-06', 'trainee', callback);
            },
            function(callback) {
                waiterCreate('Ben', 'Davis', '2000-11-08', 'the second', callback);
            },
            function(callback) {
                waiterCreate('Kate', 'Mills', '1993-01-02', 'the first', callback);
            },
            function(callback) {
                waiterCreate('Betty', 'Bronte', '1999-09-13', 'trainee', callback);
            },
        ],
        cb
    );
}

function createTables(cb) {
    async.parallel([
            function(callback) {
                tableCreate(1, 4, waiters[0], "Near the window", callback);
            },
            function(callback) {
                tableCreate(2, 6, waiters[1], "In the center of the hall", callback);
            },
            function(callback) {
                tableCreate(3, 2, waiters[2], "Next to the bar", callback);
            },
            function(callback) {
                tableCreate(4, 4, waiters[3], "In the corner of the hall", callback);
            }
        ],
        cb);
}

async.series([
    createWaiters,
    createTables,
], function cb(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    } else {
        console.log('It works!');
    }
    mongoose.connection.close();
});