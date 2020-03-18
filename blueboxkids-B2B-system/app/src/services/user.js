import request from '@/utils/request';

export async function queryCurrent() {
  return request('/v1/userInfo');
}

export async function logout(params) {
  const url = '/v1/logout'
  const resp = await request(url, {
      method: 'POST',
      data: params,
  });
  return resp;
}
