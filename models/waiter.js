const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let WaiterSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        last_name: {type: String, required: true, maxLength: 100},
        date_of_birth: {type: Date},
        category: {type: String}
    }
);

WaiterSchema
.virtual('url')
.get(function () {
  return '/catalog/waiter/' + this._id;
});

module.exports = mongoose.model('Waiter', WaiterSchema);