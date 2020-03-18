import { getStoreOrderList } from '../../../../services/order';
import { addKeyForList } from '@/utils/utils';

const Model = {
  namespace: 'storeOrder',
  state: {
    list: [],
    pageSize: 10,
    current: 1,
    searchValue: {},
    total: 0,
    selectedRowKeys: [],
    selectedRows: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getStoreOrderList, payload);
      if (response.code == '0') {
        const searchValue = payload;
        const { data } = response;
        data.current = data.pageNum;
        data.list = addKeyForList(data.list,'orderId')
        const selectedRowKeys=[]
        const selectedRows =[]
        yield put({
          type: 'save',
          payload: { ...data, searchValue ,selectedRowKeys,selectedRows},
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
        selectedRowKeys: [],
        selectedRows: [],
      };
      return { ...state, ...initdata };
    },
    onSelect(state,action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
