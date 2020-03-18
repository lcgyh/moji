import request from '@/utils/request';
import { getUrlByData } from '@/utils/utils';

// 折扣活动列表
export async function getDiscount(data) {
    let url = '/v1/activity/discount';
    const resp = await request(getUrlByData(url, data));
    return resp;
}

//新建编辑折扣
export async function saveDiscount(data) {
    const url = '/v1/activity/discount';
    const resp = await request(url, {
        method: 'POST',
        data,
    });
    return resp;
}

//折扣活动详情查询
export async function getDiscountInfo(data) {
    let url = `/v1/activity/discount/${data.discountId}`;
    const resp = await request(url);
    return resp;
}

//上新活动列表
export async function getNew(data) {
    let url = '/v1/activity/new';
    const resp = await request(getUrlByData(url, data));
    return resp;
}

//新建编辑上新活动
export async function saveNew(data) {
    const url = '/v1/activity/new';
    const resp = await request(url, {
        method: 'POST',
        data,
    });
    return resp;
}

//上新-详情
export async function getNewInfo(data) {
    let url = `/v1/activity/new/${data.newId}`;
    const resp = await request(url);
    return resp;
}

//畅销-列表
export async function getPopular(data) {
    let url = '/v1/activity/popular';
    const resp = await request(getUrlByData(url, data));
    return resp;
}
//畅销 - 编辑/新建
export async function savePopular(data) {
    const url = '/v1/activity/popular';
    const resp = await request(url, {
        method: 'POST',
        data,
    });
    return resp;
}

//畅销 - 详情
export async function getPopularInfo(data) {
    let url = `/v1/activity/popular/${data.popularId}`;
    const resp = await request(url);
    return resp;
}

//秒杀-列表
export async function getSkill(data) {
    let url = '/v1/activity/skill';
    const resp = await request(getUrlByData(url, data));
    return resp;
}
//秒杀 - 新建、编辑
export async function saveSkill(data) {
    const url = '/v1/activity/skill';
    const resp = await request(url, {
        method: 'POST',
        data,
    });
    return resp;
}

//秒杀 - 详情
export async function getSkillInfo(data) {
    let url = `/v1/activity/skill/${data.skillId}`;
    const resp = await request(url);
    return resp;
}