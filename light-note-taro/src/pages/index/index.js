import { useState, useCallback } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { AtFab, AtIcon, AtSearchBar, AtLoadMore, AtActionSheet, AtActionSheetItem } from 'taro-ui';
import { getNotes, deleteNote, deleteNotesBatch } from '../../api/note';
import './index.scss';

export default function Index() {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('more');
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchNotes = useCallback(
        async (pageNum = 1, append = false) => {
            try {
                setStatus('loading');
                const res = await getNotes({ page: pageNum, size: 10 });
                const newList = append ? [...notes, ...res.list] : res.list;
                setNotes(newList);
                setTotal(res.total);
                setPage(pageNum);
                setStatus(newList.length < res.total ? 'more' : 'noMore');
            } catch (err) {
                console.error('Fetch notes error:', err);
                setStatus('more');
            }
        },
        [notes],
    );

    useDidShow(() => {
        fetchNotes(1);
    });

    const onAddNote = () => {
        Taro.navigateTo({ url: '/pages/edit/index' });
    };

    const onNoteClick = (note) => {
        if (isBatchMode) {
            toggleSelect(note.id);
        } else {
            Taro.navigateTo({ url: `/pages/detail/index?id=${note.id}` });
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const onLongPress = (id) => {
        setIsBatchMode(true);
        toggleSelect(id);
    };

    const cancelBatch = () => {
        setIsBatchMode(false);
        setSelectedIds([]);
    };

    const handleDeleteBatch = async () => {
        if (selectedIds.length === 0) return;

        Taro.showModal({
            title: '确认删除',
            content: `确定要删除这 ${selectedIds.length} 条笔记吗？`,
            success: async (res) => {
                if (res.confirm) {
                    await deleteNotesBatch(selectedIds);
                    Taro.showToast({ title: '删除成功' });
                    cancelBatch();
                    fetchNotes(1);
                }
            },
        });
    };

    const onScrollToLower = () => {
        if (status === 'more') {
            fetchNotes(page + 1, true);
        }
    };

    return (
        <View className="index-page">
            <View className="header">
                <AtSearchBar value={searchText} onChange={setSearchText} onActionClick={() => fetchNotes(1)} />
            </View>

            <ScrollView
                className="note-list"
                scrollY
                onScrollToLower={onScrollToLower}
                refresherEnabled
                onRefresherRefresh={() => fetchNotes(1)}
            >
                {notes.length === 0 && status !== 'loading' && (
                    <View className="empty-state">
                        <AtIcon value="list" size="60" color="#ccc" />
                        <Text className="empty-text">还没有笔记，快去创建一个吧！</Text>
                    </View>
                )}

                {notes.map((note) => (
                    <View
                        key={note.id}
                        className={`note-item ${selectedIds.includes(note.id) ? 'selected' : ''}`}
                        onClick={() => onNoteClick(note)}
                        onLongPress={() => onLongPress(note.id)}
                    >
                        <View className="note-content">
                            <Text className="text-preview">{note.content}</Text>
                            <View className="note-footer">
                                <Text className="date">{note.date}</Text>
                                {note.images && note.images.split(',').length > 0 && (
                                    <AtIcon value="image" size="14" color="#999" />
                                )}
                            </View>
                        </View>
                        {isBatchMode && (
                            <View className="select-indicator">
                                <AtIcon
                                    value={selectedIds.includes(note.id) ? 'check-circle' : 'streaming'}
                                    size="20"
                                    color={selectedIds.includes(note.id) ? '#409EFF' : '#ccc'}
                                />
                            </View>
                        )}
                    </View>
                ))}

                <AtLoadMore status={status} />
            </ScrollView>

            {isBatchMode ? (
                <View className="batch-footer">
                    <View className="btn cancel" onClick={cancelBatch}>
                        取消
                    </View>
                    <View className="btn delete" onClick={handleDeleteBatch}>
                        删除({selectedIds.length})
                    </View>
                </View>
            ) : (
                <View className="fab-container">
                    <AtFab onClick={onAddNote}>
                        <Text className="at-fab__icon at-icon at-icon-add"></Text>
                    </AtFab>
                </View>
            )}
        </View>
    );
}
