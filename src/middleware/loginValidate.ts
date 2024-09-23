import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup'; 

const loginValidationSchema = yup.object().shape({
  username: yup.string().required('Username must be provided.'),
  password: yup
    .string()
    .matches(
      /^(?=.*[!@#$%^&*])/,
      'Password must be at least 8 characters long and include at least one special character.'
    )
    .min(8, 'Password must be at least 8 characters long.')
    .required('Password must be provided.'),
});

export const validateLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await loginValidationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = (error as yup.ValidationError).errors;
    res.status(400).json({ errors });
  }
};
