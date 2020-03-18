import request from '@/utils/request';
import { getUrlByData } from '@/utils/utils';

// banner-列表
export async function getBanner(data) {
    let url = '/v1/banner';
    const resp = await request(getUrlByData(url, data));
    return resp;
}

//banner-新建编辑
export async function saveBanner(data) {
    const url = '/v1/banner';
    const resp = await request(url, {
        method: 'POST',
        data,
    });
    return resp;
}

//banner - 详情
export async function getBannerInfo(data) {
    let url = `/v1/banner/${data.bannerId}`;
    const resp = await request(url);
    return resp;
}