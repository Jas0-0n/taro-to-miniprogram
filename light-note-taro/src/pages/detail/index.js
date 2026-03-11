import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtIcon, AtButton } from 'taro-ui';
import { getNote, deleteNote } from '../../api/note';
import './index.scss';

export default function Detail() {
    const router = useRouter();
    const id = router.params.id;
    const [note, setNote] = useState(null);

    useEffect(() => {
        if (id) {
            fetchNote(id);
        }
    }, [id]);

    const fetchNote = async (noteId) => {
        try {
            const res = await getNote(noteId);
            setNote(res);
        } catch (err) {
            console.error('Fetch note error:', err);
        }
    };

    const onEdit = () => {
        Taro.navigateTo({ url: `/pages/edit/index?id=${id}` });
    };

    const onDelete = async () => {
        Taro.showModal({
            title: '确认删除',
            content: '确定要删除这条笔记吗？',
            success: async (res) => {
                if (res.confirm) {
                    await deleteNote(id);
                    Taro.showToast({ title: '删除成功' });
                    setTimeout(() => {
                        Taro.navigateBack();
                    }, 1500);
                }
            },
        });
    };

    const previewImage = (current) => {
        const urls = note.images ? note.images.split(',') : [];
        Taro.previewImage({
            urls,
            current,
        });
    };

    if (!note) return null;

    return (
        <View className="detail-page">
            <View className="header">
                <View className="back-btn" onClick={() => Taro.navigateBack()}>
                    <AtIcon value="chevron-left" size="30" color="#333" />
                </View>
                <View className="actions">
                    <View className="action-item" onClick={onEdit}>
                        <AtIcon value="edit" size="24" color="#409EFF" />
                        <Text className="action-text">编辑</Text>
                    </View>
                    <View className="action-item" onClick={onDelete}>
                        <AtIcon value="trash" size="24" color="#ff4d4f" />
                        <Text className="action-text">删除</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="content-container" scrollY>
                <View className="date-info">
                    <AtIcon value="calendar" size="14" color="#999" />
                    <Text className="date-text">{note.date}</Text>
                </View>

                <Text className="content-text">{note.content}</Text>

                <View className="image-list">
                    {note.images &&
                        note.images
                            .split(',')
                            .map((url, index) => (
                                <Image
                                    key={index}
                                    src={url}
                                    className="image-item"
                                    mode="widthFix"
                                    onClick={() => previewImage(url)}
                                />
                            ))}
                </View>

                <View className="time-info">
                    <Text className="time-text">创建于: {new Date(note.createTime).toLocaleString()}</Text>
                    <Text className="time-text">修改于: {new Date(note.updateTime).toLocaleString()}</Text>
                </View>
            </ScrollView>
        </View>
    );
}
