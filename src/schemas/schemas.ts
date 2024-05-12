import * as Yup from 'yup';

export const initialValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
export const registerSchema = Yup.object({
  displayName: Yup.string().min(2).max(20).required('Display Name cannot be empty'),
  email: Yup.string().email().required('Email cannot be empty'),
  password: Yup.string().min(6).required('Password cannot be empty'),
  confirmPassword: Yup.string()
    .required('Confirm Password cannot be empty')
    .oneOf([Yup.ref('password')], 'Pasword must match'),
});

export const loginSchema = Yup.object({
  email: Yup.string().email().required('Email cannot be empty'),
  password: Yup.string().min(6).required('Password cannot be empty'),
});
