import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { logout } from '@/services/user'
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import router from 'umi/router';

const Model = {
  namespace: 'login',
  state: {
    // status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response.code == '0') {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // const { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);

        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // yield put(routerRedux.replace('/'));
        router.push({
          pathname: '/',
        });
      }
    },

    *logout(_, { call, put }) {
      const result = yield call(logout)
      if (result.code == '0') {
        localStorage.clear()
        router.push({
          pathname: '/',
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      const token = payload.data;
      const currentAuthority = [];
      if (token) {
        setAuthority(currentAuthority, token);
      }
      return {};
    },
  },
};
export default Model;
