const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    checks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Check',
    }],
});

const User = mongoose.model("user", userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(15).required(),

    });
    return schema.validate(user);
};

module.exports = {
    User,
    validateUser,
};
