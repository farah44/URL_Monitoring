const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require("joi");

const checkSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    url: {
        type: String,
        required: true,
    },

    protocol: {
        type: String,
        required: true,
    },

    path: {
        type: String,
    },

    port: {
        type: Number,
    },

    webhook: {
        type: String,
    },

    timeout: {
        type: Number,
        default: 5,
    },

    interval: {
        type: Number,
        default: 10,
    },

    threshold: {
        type: Number,
        default: 1,
    },

    authentication: {
        username: {
            type: String,
        },
        password: {
            type: String,
        },
    },

    httpHeaders: [{
        key: {
            type: String,
        },
        value: {
            type: String,
        },
    }
    ],

    assert: {
        statusCode: {
            type: Number,
        },
    },

    ignoreSSL: {
        type: Boolean,
        required:true,
    },

    tags: [
        {
            type: String,
        },
    ],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

},
    {
    timestamps: true,
     }

);
const validateCheck = (check) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        url: Joi.string().min(5).required(),
        protocol: Joi.string().valid("HTTP","HTTPS","TCP").required(),
        path: Joi.string(),
        port: Joi.number(),
        webhook: Joi.string(),
        timeout: Joi.number(),
        interval: Joi.number(),
        threshold: Joi.number(),
        userId: Joi.string().required(),
        ignoreSSL: Joi.bool(),
        tags: Joi.array().items(Joi.string()),
    });

    return schema.validate(check);
};
const Check = mongoose.model('Check', checkSchema);

module.exports = {
    Check,
    validateCheck
};