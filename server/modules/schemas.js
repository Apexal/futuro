const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA NAMES MUST BE IN PascalCase
module.exports = {
    Activity: {
        date: { type: Date, required: true },
        startTime: String,
        endTime: String, /* '9:10 AM' (optional) */
        summary: String,
        description: String,
        value: { type: Number, default: 0 }
    }
};