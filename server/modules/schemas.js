const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA NAMES MUST BE IN PascalCase
module.exports = {
    schemas: {
        Activity: {
            date: { type: Date, required: true },
            startTime: String,
            endTime: String, /* '9:10 AM' (optional) */
            summary: String,
            description: String,
            value: { type: Number, default: 0 }
        },
        Reflection: {
            date: { type: Date, required: true },
            title: String,
            description: { type: String, required: true },
            tags: { type: Array, default: [] },
            last_updated: Date
        },
        Rating: {
            date: { type: Date, required: true },
            value: { type: Number, min: 1, max: 5, default: 4 }
        },
        Person: {
            name: {
                nickname: String,
                first: { type: String, required: true },
                last: { type: String, required: true },
                unique: { type: String, required: true }
            },
            gender: { type: String, required: true },
            title: String,
            relation: { type: String, required: true },
            description: String,
            levels: {

            },
            tags: { type: [ String ], default: [] }
        }
    }, options: {
        Reflection: { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
    }
};