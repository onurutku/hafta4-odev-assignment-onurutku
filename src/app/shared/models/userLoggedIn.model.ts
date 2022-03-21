export class UserLoggedIn {
  constructor(
    public email: string,
    public localId: string,
    public idToken: string,
    public expirationDate: Date
  ) {
    (this.email = email),
      (this.localId = localId),
      (this.idToken = idToken),
      (this.expirationDate = expirationDate);
  }
}
