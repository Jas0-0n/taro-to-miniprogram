import { useState, useEffect } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Textarea, Text, ScrollView } from "@tarojs/components";
import { AtButton, AtIcon, AtFloatLayout } from "taro-ui";
import { getNote, createNote, updateNote } from "../../api/note";
import EmojiPicker from "../../components/EmojiPicker";
import ImageUpload from "../../components/ImageUpload";
import CalendarPicker from "../../components/CalendarPicker";
import "./index.scss";

export default function Edit() {
    const router = useRouter();
    const id = router.params.id;

    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            Taro.setNavigationBarTitle({ title: "编辑笔记" });
            fetchNote(id);
        } else {
            Taro.setNavigationBarTitle({ title: "新增笔记" });
        }
    }, [id]);

    const fetchNote = async (noteId) => {
        try {
            const res = await getNote(noteId);
            setContent(res.content);
            setImages(res.images ? res.images.split(",") : []);
            setDate(res.date);
        } catch (err) {
            console.error("Fetch note error:", err);
        }
    };

    const handleSave = async () => {
        if (!content.trim() && images.length === 0) {
            Taro.showToast({ title: "内容或图片不能为空", icon: "none" });
            return;
        }

        try {
            setIsSubmitting(true);
            const data = {
                content,
                images: images.join(","),
                date,
            };

            if (id) {
                await updateNote(id, data);
            } else {
                await createNote(data);
            }

            Taro.showToast({ title: "保存成功", icon: "success" });
            setTimeout(() => {
                Taro.navigateBack();
            }, 1500);
        } catch (err) {
            console.error("Save note error:", err);
            setIsSubmitting(false);
        }
    };

    const onSelectEmoji = (emoji) => {
        setContent((prev) => prev + emoji);
        setShowEmoji(false);
    };

    const onSelectDate = (newDate) => {
        setDate(newDate);
        setShowCalendar(false);
    };

    return (
        <View className="edit-page">
            <View className="header">
                <View className="cancel-btn" onClick={() => Taro.navigateBack()}>
                    取消
                </View>
                <AtButton
                    type="primary"
                    size="small"
                    onClick={handleSave}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    保存
                </AtButton>
            </View>

            <ScrollView className="editor-container" scrollY>
                <Textarea
                    className="content-input"
                    placeholder="记录下这一刻的想法吧..."
                    value={content}
                    onInput={(e) => setContent(e.detail.value)}
                    maxlength={-1}
                    autoHeight
                />

                <ImageUpload images={images} onChange={setImages} />
            </ScrollView>

            <View className="toolbar">
                <View className="tool-item" onClick={() => setShowEmoji(true)}>
                    <AtIcon value="heart" size="24" color="#666" />
                    <Text className="tool-label">表情</Text>
                </View>
                <View className="tool-item" onClick={() => setShowCalendar(true)}>
                    <AtIcon value="calendar" size="24" color="#666" />
                    <Text className="tool-label">{date}</Text>
                </View>
            </View>

            <AtFloatLayout
                isOpened={showEmoji}
                title="选择表情"
                onClose={() => setShowEmoji(false)}
            >
                <EmojiPicker onSelect={onSelectEmoji} />
            </AtFloatLayout>

            <AtFloatLayout
                isOpened={showCalendar}
                title="选择日期"
                onClose={() => setShowCalendar(false)}
            >
                <CalendarPicker currentDate={date} onSelect={onSelectDate} />
            </AtFloatLayout>
        </View>
    );
}
