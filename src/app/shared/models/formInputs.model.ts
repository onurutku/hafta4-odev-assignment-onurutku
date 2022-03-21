export class FormInput {
  constructor(public email: string, public password: string) {
    (this.email = email), (this.password = password);
  }
}
