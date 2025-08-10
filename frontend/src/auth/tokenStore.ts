let csrfToken: string | null = null;
let accessToken: string | null = null;

export const getCSRFToken = (): string | null => csrfToken;
export const setCSRFToken = (token: string | null): void => {
  csrfToken = token;
};

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
