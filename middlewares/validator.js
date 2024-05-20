const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }else{
        return next();
    }
}

exports.validateSignUp = 
[body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
// TODO: DO PASSWORDS NEED TRIMMED
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})];

exports.validateLogIn = 
[body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})];

// TODO: ASK IF (TOTAL OFFERS, ACTIVE, HIGHEST OFFER) NEED VALIDATOR
exports.validateItem = 
// TODO: ASK IF ISIN() NEEDS PARAMETERS AND IF ISINT IS DONE CORRECTLY
[body('condition', 'condition name cannot be empty').notEmpty().trim().escape().isIn(["New", "Mint", "Used", "Fine", "Poor"]),
body('title', 'title name cannot be empty').notEmpty().trim().escape(),
body('price', 'price name cannot be empty').notEmpty().trim().escape().isInt({min:0.01}),
body('medium', 'medium name cannot be empty').notEmpty().trim().escape().isIn(["DVD", "VHS", "Lazer-Disk"]),
body('details', 'detail must be at least 10 character and at most 64 characters').isLength({min:10, max:64}).trim().escape(),
body('image', 'image name cannot be empty').notEmpty().trim().escape()];

exports.validateOffer =
[body('amount', 'amount name cannot be empty').notEmpty().trim().escape().isInt({min:0.01})]
