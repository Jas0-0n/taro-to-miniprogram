import Taro from '@tarojs/taro';

const BASE_URL = 'http://localhost:3000/api';

export const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_URL}/upload/image`,
      filePath,
      name: 'file',
      success: (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          const data = JSON.parse(res.data);
          resolve(data.url);
        } else {
          reject(new Error('上传失败'));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
