const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA NAMES MUST BE IN PascalCase
module.exports = {
    Activity: {
        date: { type: Date, required: true },
        summary: { type: String, required: true },
        description: String,
        value: { type: Number, default: 0 }
    }
};