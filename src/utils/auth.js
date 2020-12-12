const ACCESS_TOKEN = 'access_token';

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};
export const setToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN, token);
};
export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};

export const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};
