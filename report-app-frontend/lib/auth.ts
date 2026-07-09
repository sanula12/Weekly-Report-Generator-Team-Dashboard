import Cookies from 'js-cookie';

export const saveAuth = (token: string, role: string, name: string) => {
  Cookies.set('token', token, { expires: 1 });
  Cookies.set('role', role, { expires: 1 });
  Cookies.set('name', name, { expires: 1 });
};

export const getRole = () => Cookies.get('role');
export const getName = () => Cookies.get('name');
export const isLoggedIn = () => !!Cookies.get('token');

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('role');
  Cookies.remove('name');
};