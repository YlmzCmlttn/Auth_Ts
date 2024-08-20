const Joi = require('joi');

const registerValidatorScheme = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(30).required()
    //.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,30}$'))
});
const loginValidatorScheme = Joi.object({
    login: Joi.alternatives().try(
        Joi.string().email().lowercase(), // Email validation
        Joi.string().alphanum().min(3).max(128) // Username validation
    ).required(),
    password: Joi.string().min(8).max(30).required()
});
export { 
    registerValidatorScheme,
    loginValidatorScheme
};  