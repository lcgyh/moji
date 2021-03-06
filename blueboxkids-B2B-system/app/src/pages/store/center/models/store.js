import { getStore } from '../../../../services/store';
import { addKeyForList } from '@/utils/utils';

const Model = {
  namespace: 'store',
  state: {
    list: [],
    pageSize: 10,
    current: 1,
    searchValue: {},
    total: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getStore, payload);
      if (response.code == '0') {
        const searchValue = payload;
        const { data } = response;
        data.current = data.pageNum;
        data.list = addKeyForList(data.list)
        yield put({
          type: 'save',
          payload: { ...data, searchValue },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    initState(state) {
      const initdata = {
        list: [],
        pageSize: 10,
        current: 1,
        total: 0,
      };
      return { ...state, ...initdata };
    },
  },
};
export default Model;
