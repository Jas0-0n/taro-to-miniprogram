import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import { uploadImage } from '../../api/upload';
import './index.scss';

export default function ImageUpload({ images = [], onChange }) {
    const chooseImage = async () => {
        if (images.length >= 5) {
            Taro.showToast({ title: '最多只能上传5张图片', icon: 'none' });
            return;
        }

        try {
            const res = await Taro.chooseImage({
                count: 5 - images.length,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
            });

            const uploadPromises = res.tempFilePaths.map((path) => uploadImage(path));
            const urls = await Promise.all(uploadPromises);

            onChange([...images, ...urls]);
        } catch (err) {
            console.error('Choose image error:', err);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const previewImage = (url) => {
        Taro.previewImage({
            urls: images,
            current: url,
        });
    };

    return (
        <View className="image-upload">
            {images.map((url, index) => (
                <View key={index} className="image-item">
                    <Image src={url} className="img" mode="aspectFill" onClick={() => previewImage(url)} />
                    <View className="remove-btn" onClick={() => removeImage(index)}>
                        <AtIcon value="close" size="12" color="#fff" />
                    </View>
                </View>
            ))}
            {images.length < 5 && (
                <View className="upload-btn" onClick={chooseImage}>
                    <AtIcon value="add" size="30" color="#ccc" />
                    <Text className="upload-text">上传图片</Text>
                </View>
            )}
        </View>
    );
}
