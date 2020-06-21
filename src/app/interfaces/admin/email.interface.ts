export interface IEmailMessage {
  key?: string;
  domain: string;
  email: string;
  header: string;
  message: string;
  name: string;
}

export interface IEmailMessages {
  [key: string]: IEmailMessage;
}
