import Joi from "joi";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ChangePassword = Joi.object({
    oldPassword: Joi.string().regex(passwordRegex).required().messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      }),
      newPassword: Joi.string().regex(passwordRegex).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
  }),
  cPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .strict()
    .messages({
      "any.only": "Confirm password must match the password field",
    }),
});
export const UpdateUser=Joi.object({
    userName: Joi.string().alphanum().min(5).max(25).required(),
    phone: Joi.string().pattern(/^(010|011|012|015)[0-9]{8}$/).required().messages({  'string.pattern.base': 'Phone number must start with 010, 011, or 015 and must conatin 11 numeric digits',}),
    age: Joi.number().positive().integer().min(16).max(120),

})