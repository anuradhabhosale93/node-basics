const { check } = require('express-validator/check');

const signup = [
    check('email').exists().isEmail().withMessage('Email is required with Proper email format'),
    check('firstName').custom((value) => {
        if (!value.match(/^[a-zA-Z]+$/)) {
            throw new Error('First name must contain characters only');
        } else { return value; }
    }),
    check('lastName').custom((value) => {
        if (!value.match(/^[a-zA-Z]+$/)) {
            throw new Error('Last name must contain characters only');
        } else { return value; }
    }),
    check('username').isLength({ min: 1 }).withMessage('username is required'),
    check('password').isLength({ min: 10 }).withMessage('password is required'),
];

const signin = [
    check('usernameOrEmail').isLength({ min: 1 }).withMessage('Username or Email is required'),
    check('password').isLength({ min: 10 }).withMessage('password is required'),

];
module.exports = {
    signup,
    signin
};