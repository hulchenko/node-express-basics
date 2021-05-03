const { body } = require('express-validator/check');

//normalizeEmail() and trim() are sanitizers for the validator
//LOGIN SECTION:
exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Please Enter Correct Email Address')
    .normalizeEmail(),
  body('password', 'Password too short. 6 characters min.')
    .isLength({ min: 6, max: 20 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name too short. 3 characters min')
    .trim(),
];

//ADD NEW COURSE SECTION:
exports.courseValidators = [
  body('title')
    .isLength({ min: 5 })
    .withMessage('Course Name too short. 5 characters min')
    .trim(),
  body('price').isNumeric().withMessage('Enter correct price'),
  body('img').isURL().withMessage('Enter correct URL'),
];
