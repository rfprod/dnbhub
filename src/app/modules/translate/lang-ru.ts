import { IDictionaryObject, SUPPORTED_LANGUAGE_KEY } from './translations.interface';

export const LANG_RU_NAME = SUPPORTED_LANGUAGE_KEY.RUSSIAN;

/**
 * Russian substrings for UI.
 */
export const LANG_RU_TRANSLATIONS: IDictionaryObject = {
  title: 'DNBHUB',
  back: 'Назад',
  index: 'Индекс',
  playlists: 'Плейлисты',
  blog: 'Блог',
  login: 'Вход',
  logout: 'Выход',
  user: 'Пользователь',
  admin: 'Администратор',
  about: 'Информация',
  language: {
    title: 'Язык',
    en: 'Английский',
    ru: 'Русский',
  },
  contact: {
    open: 'Отправить сообщение',
    title: 'Контактная форма',
    result: {
      success: 'Ваше сообщение было успешно отправлено.',
      fail: 'Отправка сообщения не удалась. Пожалуйста, попробуй позже.',
    },
  },
  subscribe: {
    title: 'Email-рассылка',
    result: {
      success: 'Указанный адрес эл. почты был добавлен в список email-рассылки.',
      fail: 'Подписка на новостную email-рассылку не удалась. Пожалуйста, попробуйте позже.',
    },
  },
  form: {
    email: 'Эл. почта',
    password: 'Пароль',
    name: 'Имя',
    link: 'Ссылка',
    header: 'Заголовок',
    message: 'Сообщение',
    invalid: {
      email: 'Неправильный адрес эл. почты',
      password: 'Неправильный пароль, 8+ символов',
      name: 'Неправильное имя: 2+ знаков',
      link: 'Неправильная ссылка, формат: http(s)://...',
      header: 'Неправильный заголовок: 3+ знаков',
      message: 'Неправильное сообщеие: 50+ знаков',
    },
  },
  action: {
    confirm: 'Подтвердить',
    cancel: 'Отмеить',
    close: 'Закрыть',
    play: 'Играть',
    download: 'Скачать',
    select: 'Выбрать',
    resetPassword: 'Сбросить пароль',
    createAccount: 'Создать учётую запись',
  },
};
