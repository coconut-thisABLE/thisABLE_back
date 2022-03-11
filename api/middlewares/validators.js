const Joi = require('joi');

/* Access.js */
const isSignUpValid = Joi.object({
  email: Joi.string()
      .email()
      .required(),

  password: Joi.string()
      .required(),

  repeat_pwd: Joi.string()
      .valid(Joi.ref('password'))
      .error(new Error('repeat_pwd must be equal with password.'))
      .required(),

  type: Joi.string()
      .valid('d', 'n')
      .required(),
});

const isLoginValid = Joi.object({
  email: Joi.string()
      .email()
      .required(),

  password: Joi.string()
      .required(),
});

module.exports = {
  UserValidator: {
    isSignUpValid,
    isLoginValid,
  },
};
