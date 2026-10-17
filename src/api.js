export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getCookie = (name) => {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : '';
};

export const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const apiError = (res, json) => {
  if (json && json.details && Array.isArray(json.details) && json.details.length) {
    return `${json.message}: ${json.details.join(', ')}`;
  }
  if (json && json.message) return json.message;
  return res && res.ok ? 'Something went wrong' : 'Unable to reach server';
};
