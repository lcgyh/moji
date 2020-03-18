import request from '@/utils/request';
import { obj2params } from '@/utils/utils';

// 获取供应商列表
export async function getSupply(data) {
    let url = '/v1/supplierList';
    if (obj2params(data)) {
        url = `${url}?${obj2params(data)}`;
    }
    const resp = await request(url);
    return resp;
}

// 获取所有的供应商
export async function getSupplys() {
  const url = '/v1/suplier';
  const resp = await request(url);
  return resp;
}


// 获取供应商详情
export async function getSupplyInfo(data) {
    const url = `/v1/supplier/${data.supplierId}`;
    const resp = await request(url);
    return resp;
}

// 供应商新建或者编辑保存
export async function saveSupply(params) {
    const url = '/v1/supplier';
    const resp = await request(url, {
        method: 'POST',
        data: params,
    });
    return resp;
}

// 门店重置密码
export async function supplyPassReset(params) {
    const url = `/v1/supplier/pwd/${params.supplierId}`;
    const resp = await request(url, {
        method: 'PUT',
    });
    return resp;
}
