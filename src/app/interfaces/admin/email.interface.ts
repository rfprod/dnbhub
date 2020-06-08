export interface IEmailSubmission {
  key?: string;
  domain: string;
  email: string;
  link: string;
}

export interface IEmailSubmissions {
  [key: string]: IEmailSubmission;
}

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
