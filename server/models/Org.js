const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Org = new Schema({
    organizationName: {
        type: String,
        required: true,
        unique: true,
    },
    organizationId: {
        type: String,
        required: true,
        unique: true,
    },
    dbName: {
        type: String,
        required: true,
        unique: false,       
    },
    status: {
        type: String,
        required: true,
        unique: false,       
    }
},{
    collection: 'orgs'
});
module.exports = mongoose.model('Org', Org)