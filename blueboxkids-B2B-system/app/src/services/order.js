import request from '@/utils/request';
import { obj2params, getUrlByData } from '@/utils/utils';


// 门店订单查询
export async function getStoreOrderList(data) {
  const url = '/v1/order';
  const resp = await request(getUrlByData(url, data));
  return resp;
}
// 门店订单详情查询
export async function getStoreOrderInfo(orderId) {
  return request(`/v1/order/${orderId}`);
}
// 发货接口 & 补充快递单号接口
export async function sendOrder(data) {
  const url = '/v1/order/delivery';
  // if (obj2params(data)) {
  //   url = `${url}?${obj2params(data)}`;
  // }
  const resp = await request(url, {
    method: 'PUT',
    data,
  });
  return resp;
}
