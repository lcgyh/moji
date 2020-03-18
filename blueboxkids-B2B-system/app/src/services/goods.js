import request from '@/utils/request';
import { getUrlByData } from '@/utils/utils';

// 商品 - 列表
export async function getGoodsList(data) {
  const url = '/v1/product';
  const resp = await request(getUrlByData(url, data));
  return resp;
}

// 商品 -保存
export async function saveGoods(data) {
  const url = '/v1/product';
  const resp = await request(url, {
    method: 'POST',
    data,
  });
  return resp;
}

// 商品 - 详情
export async function getGoodsInfo(data) {
  const url = `/v1/product/detail/${data.spuId}`;
  const resp = await request(url);
  return resp;
}

// 商品 - 日志
export async function getGoodsLog(data) {
  const url = `/v1/product/log/${data.skuId}`;
  const resp = await request(getUrlByData(url, data));
  return resp;
}

// 商品 -状态
export async function saveGoodsChangeState(data) {
  const url = '/v1/product/status';
  const resp = await request(url, {
    method: 'PUT',
    data,
  });
  return resp;
}


// 规格
export async function getSpec(data) {
  const url = '/v1/product/spec';
  const resp = await request(getUrlByData(url, data));
  return resp;
}
// 新增或者编辑规格
export async function editSpec(params) {
  const url = '/v1/product/spec';
  const resp = await request(url, {
    method: 'POST',
    data: params,
  });
  return resp;
}

// 根据规格id查询属性信息
export async function getSpecAttr(data) {
  const url = `/v1/product/specAttr/${data.specId}`;
  const resp = await request(url);
  return resp;
}

// 新增规格属性
export async function addSpecAttr(params) {
  const url = '/v1/product/specAttr';
  const resp = await request(getUrlByData(url, params), {
    method: 'PUT',
    data: params,
  });
  return resp;
}

// 编辑规格属性
export async function editSpecAttr(params) {
  const url = '/v1/product/specAttr';
  const resp = await request(getUrlByData(url, params), {
    method: 'PUT',
    data: params,
  });
  return resp;
}

// 删除规格属性
export async function delSpecAttr(params) {
  const url = '/v1/product/specAttr';
  const resp = await request(getUrlByData(url, params), {
    method: 'PUT',
    data: params,
  });
  return resp;
}

// 库存 - 查询
export async function getInv(data) {
  const url = `/v1/product/inv/${data.skuId}`;
  const resp = await request(url);
  return resp;
}
// 库存 - 更新
export async function invUpdata(params) {
  const url = `/v1/product/inv/${params.skuId}/${params.qtyChange}`;
  const resp = await request(url, {
    method: 'PUT',
    data: {},
 });
  return resp;
}
