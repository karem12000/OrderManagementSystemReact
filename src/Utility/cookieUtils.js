import Cookies from 'js-cookie';

export const getUserId = () => {
    return Cookies.get('userId');
};

export const getToken = () => {
    return Cookies.get('token');
};

export const removeCookies = () => {
     Cookies.remove('token');
     Cookies.remove('userId');
};