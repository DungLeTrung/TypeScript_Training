import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup'; 

const registerValidationSchema = yup.object().shape({
  username: yup.string().required('Username must be provided.'),
  password: yup
    .string()
    .matches(
      /^(?=.*[!@#$%^&*])/,
      'Password must be at least 8 characters long and include at least one special character.'
    )
    .min(8, 'Password must be at least 8 characters long.')
    .required('Password must be provided.'),
  name: yup.string().required('Name must be provided.'),
  email: yup
    .string()
    .email('Email must be a valid email address.')
    .required('Email must be provided.'),
  date_of_birth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be a future date.')
    .required('Date of birth must be provided.'),
  invite_id: yup.string().notRequired()
});

export const validateRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await registerValidationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = (error as yup.ValidationError).errors;
    res.status(400).json({ errors });
  }
};
