/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
export class ScInitOptions {
  constructor(clientId = '', redirectUri = '') {
    this.client_id = clientId;
    this.redirect_uri = redirectUri;
  }
  public client_id: string;
  public redirect_uri: string;
}
