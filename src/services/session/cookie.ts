import Cookies from 'js-cookie';

export const getUid = (): string | undefined => {
  return Cookies.get('SESSION_UID');
};

export const setUid = (uid: string): void => {
  Cookies.set('SESSION_UID', uid), {
    expires: 8/24 // 8 hours
  };
};

export const isUidSet = (): boolean => {
  return !!getUid();
};
