import { parse } from 'querystring';
import { isArray } from 'util';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export const obj2params = obj => {
  let result = '';
  let item;
  for (item in obj) {
    if ((obj[item] && String(obj[item])) || String(obj[item]) == 'false') {
      result += `&${item}=${obj[item]}`;
    }
  }
  if (result) {
    result = result.slice(1);
  }
  return result;
};


export const getUrlByData = (url, data) => {
  let newurl = url;
  if (data && obj2params(data)) {
    newurl = `${newurl}?${obj2params(data)}`;
  }
  return newurl
}




export const addKeyForList = (arr, keys) => {
  let result = arr
  if (result && isArray(result) && result.length > 0) {
    for (var i = 0; i < result.length; i++) {
      result[i].key = keys ? result[i][keys] : i
    }
  }

  return result;
};




export const getPageQuery = () => parse(window.location.href.split('?')[1]);
