import {getStorage} from 'apphelpers/utilities'

export const hasAccess = function (access) {
    const data = getStorage('access', true);
    if (data && data.indexOf(access) > -1) return true;
    return false;
}