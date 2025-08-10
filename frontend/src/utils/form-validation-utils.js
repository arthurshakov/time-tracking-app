import * as yup from 'yup';

const inputMatchConfig = [
  /^[a-zA-Z0-9_.]+$/,
  'Only letters (a-z, A-Z), numbers (0-9), underscores (_), and dots (.) are allowed'
]

export const getLoginSchema = () => (
  yup.string()
    .required('Enter your login')
    .matches(...inputMatchConfig)
    .min(3, 'Login must be a\u00A0minimum of\u00A03\u00A0symbols')
    .max(15, 'Login must be a\u00A0maximum of\u00A015\u00A0symbols')
)

export const getPasswordSchema = () => (
  yup.string()
    .required('Enter your password')
    .matches(...inputMatchConfig)
    .min(3, 'Password must be a\u00A0minimum of\u00A03\u00A0symbols')
    .max(15, 'Password must be a\u00A0maximum of\u00A015\u00A0symbols')
)

export const getRepeatPasswordSchema = () => (
  yup.string()
    .required('Repeat password')
    .oneOf([yup.ref('password'), null], "Passwords don't match")
)

export const getFormSchema = (fields = ['login', 'password']) => {
  const schema = {};

  if (fields.includes('login')) schema.login = getLoginSchema();
  if (fields.includes('password')) schema.password = getPasswordSchema();
  if (fields.includes('repeat-password')) schema.repeatPassword = getRepeatPasswordSchema();

  return yup.object().shape(schema);
}
