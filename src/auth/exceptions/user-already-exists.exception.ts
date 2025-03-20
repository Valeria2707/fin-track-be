export class UserAlreadyExistsException extends Error {
  constructor(message = 'User with this email already exists') {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}
