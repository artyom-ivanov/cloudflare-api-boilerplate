import { Locales } from ".";

type ErrorDescriptor = {
  substring: string;
  error_code: number;
  status_code: number;
  message: Record<Locales, string>;
};

const ERRORS_DESCRIPTORS: Record<number, ErrorDescriptor> = {
  401: {
    substring: `Invalid Bearer token`,
    status_code: 401,
    error_code: 401,
    message: {
      en: "Unauthorized or token expired",
      ru: "Пользователь неавторизован, истек срок жизни токена авторизации или токен невалиден",
    },
  },
  101: {
    substring: `"x509" must be X.509 formatted string`,
    status_code: 500,
    error_code: 101,
    message: {
      en: "Wrong token format",
      ru: "Неверный формат токена авторизации",
    },
  },
  102: {
    substring: `signature verification failed`,
    status_code: 500,
    error_code: 102,
    message: {
      en: "Signature verification failed",
      ru: "Подпись токена авторизации не прошла проверку",
    },
  },
};

const detectError = (message: string, lang: Locales) => {
  const error = Object.values(ERRORS_DESCRIPTORS).find((error) =>
    message.includes(error.substring)
  );

  if (error) {
    return {
      status: "error",
      code: error.error_code,
      status_code: error.status_code,
      message: error.message[lang],
      original_error: message,
    };
  }
};

export { detectError };
