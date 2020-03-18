import request from '@/utils/request';
import { obj2params } from '@/utils/utils';

// 获取门店列表
export async function getStore(data) {
    let url = '/v1/shop';
    if (obj2params(data)) {
        url = `${url}?${obj2params(data)}`;
    }
    const resp = await request(url);
    return resp;
}

//获取门店详情
export async function getStoreInfo(data) {
    let url = `/v1/shop/${data.shopId}`;
    const resp = await request(url);
    return resp;
}

//门店新建或者编辑保存
export async function storeSave(params) {
    let url = '/v1/shop';
    const resp = await request(url, {
        method: 'POST',
        data: params,
    });
    return resp;
}

//门店重置密码
export async function storePassReset(params) {
    let url = `/v1/shop/pwd/${params.shopId}`;
    const resp = await request(url, {
        method: 'PUT',
    });
    return resp;
}
