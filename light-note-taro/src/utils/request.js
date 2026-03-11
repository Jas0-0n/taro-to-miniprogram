import Taro from '@tarojs/taro';

const BASE_URL = 'http://localhost:3000/api';

const request = (options) => {
    const { url, method = 'GET', data = {}, header = {} } = options;

    return Taro.request({
        url: `${BASE_URL}${url}`,
        method,
        data,
        header: {
            'Content-Type': 'application/json',
            ...header,
        },
    })
        .then((res) => {
            const { statusCode, data: responseData } = res;
            if (statusCode >= 200 && statusCode < 300) {
                return responseData;
            } else {
                Taro.showToast({
                    title: responseData.message || '请求失败',
                    icon: 'none',
                });
                throw new Error(responseData.message || '请求失败');
            }
        })
        .catch((err) => {
            console.error('Request Error:', err);
            throw err;
        });
};

export default request;
