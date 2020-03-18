import { addKeyForList } from '@/utils/utils';
import { getBanner } from '@/services/banner';


const Model = {
  namespace: 'banner',
  state: {
    list: [],
    pageSize: 10,
    current: 1,
    searchValue: {},
    total: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getBanner, payload);
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
