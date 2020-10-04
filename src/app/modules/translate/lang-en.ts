import { IDictionaryObject, SUPPORTED_LANGUAGE_KEY } from './translations.interface';

export const LANG_EN_NAME = SUPPORTED_LANGUAGE_KEY.ENGLISH;

/**
 * English substrings for UI.
 */
export const LANG_EN_TRANSLATIONS: IDictionaryObject = {
  title: 'DNBHUB',
  back: 'Back',
  index: 'Index',
  playlists: 'Playlists',
  blog: 'Blog',
  login: 'Login',
  logout: 'Logout',
  user: 'User',
  admin: 'Admin',
  about: 'About',
  language: {
    title: 'Language',
    en: 'English',
    ru: 'Russian',
  },
  contact: {
    open: 'Send message',
    title: 'Contact form',
    result: {
      success: 'Your message was successfully sent.',
      fail: 'Message sending failed. Please, try again later.',
    },
  },
  subscribe: {
    title: 'Mailing list',
    result: {
      success: 'Provided email address was added to mailing list.',
      fail: 'Mailing list subscription failed. Please, try again later.',
    },
  },
  form: {
    email: 'Email',
    password: 'Password',
    name: 'Name',
    link: 'Link',
    header: 'Header',
    message: 'Message',
    invalid: {
      email: 'Invalid email',
      password: 'Invalid password, 8+ characters',
      name: 'Invalid name: 2+ characters',
      link: 'Invalid link, format: http(s)://...',
      header: 'Invalid header: 3+ characters',
      message: 'Invalid message: 50+ characters',
    },
  },
  action: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    play: 'Play',
    download: 'Download',
    select: 'Select',
    resetPassword: 'Reset password',
    createAccount: 'Create account',
  },
};
