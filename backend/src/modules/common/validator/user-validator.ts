import validator from 'validator';

export class UserValidator {
  static validate(body, toValidate: string[]) {
    const errors: string[] = [];

    if (toValidate.includes('fullName') && validator.isEmpty(body.fullName)) {
      errors.push('Name cannot be empty');
    }

    if (toValidate.includes('email') && !validator.isEmail(body.email)) {
      errors.push('Invalid Email format');
    }

    if (
      toValidate.includes('password') &&
      validator.isEmpty(body.password)
    ) {
      errors.push('Password cannot be empty');
    }

    if (
        toValidate.includes('passwordConfirmation') &&
        validator.isEmpty(body.passwordConfirmation)
    ) {
      errors.push('Confirm password cannot be empty');
    }

    if (
      toValidate.includes('weight') &&
      validator.isEmpty(body.weight)
    ) {
      errors.push('Weight cannot be empty');
    }

    return errors;
  }
}