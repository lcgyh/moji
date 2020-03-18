import request from '@/utils/request';
import { obj2params } from '@/utils/utils';

// 获取品牌列表
export async function getBrand(data) {
  let url = '/v1/brandList';
  if (obj2params(data)) {
    url = `${url}?${obj2params(data)}`;
  }
  const resp = await request(url);
  return resp;
}

// 所有品牌名称查询
export async function getBrands() {
  const url = '/v1/brand';
  const resp = await request(url);
  return resp;
}

// 新建，修改品牌保存
export async function saveBrand(data) {
  const url = '/v1/brand';
  const resp = await request(url, {
    method: 'POST',
    data,
  });
  return resp;
}

// 品牌详情
export async function getBrandInfo(data) {
  const url = `/v1/brand/${data.brandId}`;
  const resp = await request(url);
  return resp;
}
