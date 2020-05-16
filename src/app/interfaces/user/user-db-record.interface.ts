/* eslint-disable @typescript-eslint/naming-convention */
/**
 * User Database record interface.
 */
export interface UserDbRecord {
  created: number;
  sc_code: string;
  sc_id: number;
  sc_oauth_token: string;
  submittedPlaylists: {
    [key: number]: boolean;
  };
}
