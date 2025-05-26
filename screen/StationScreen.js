import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Animated,
    PanResponder,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function StationScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { stationName } = route.params;

    // 샘플 더미 데이터
    const dummyData = [
        { time: '08:00', shuttle: true, buses: [] },
        { time: '08:10', shuttle: true, buses: [] },
        { time: '08:40', shuttle: false, buses: ['순환5번'] },
        { time: '08:45', shuttle: true, buses: ['1000번'] },
        { time: '09:00', shuttle: true, buses: [] },
        { time: '09:45', shuttle: false, buses: ['500번'] },
        { time: '10:00', shuttle: true, buses: [] },
    ];

    const [selectedDay, setSelectedDay] = useState('weekday');
    const [checkboxes, setCheckboxes] = useState({ shuttle: true, bus: true });
    const [timeTableData, setTimeTableData] = useState([]);

    // 가로 스크롤 상태
    const scrollRef = useRef(null);
    const pan = useRef(new Animated.Value(0)).current;
    const panValue = useRef(0);
    const [scrollAreaWidth, setScrollAreaWidth] = useState(1);
    const [contentWidth, setContentWidth] = useState(1);
    const maxThumb = Math.max(scrollAreaWidth - 80, 1);
    const totalScroll = Math.max(contentWidth - scrollAreaWidth, 1);

    // PanResponder
    pan.addListener(({ value }) => (panValue.current = value));
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                let newX = gesture.dx + panValue.current;
                newX = Math.max(0, Math.min(newX, maxThumb));
                pan.setValue(newX);
                const ratio = newX / maxThumb;
                scrollRef.current?.scrollTo({ x: ratio * totalScroll, animated: false });
            },
        })
    ).current;

    useEffect(() => {
        setTimeTableData(dummyData);
    }, [selectedDay]);

    const toggleCheckbox = key => {
        setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const onTableScroll = event => {
        const x = event.nativeEvent.contentOffset.x;
        const ratio = x / totalScroll;
        pan.setValue(ratio * maxThumb);
    };

    const screenHeight = Dimensions.get('window').height;

    return (
        <SafeAreaView style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{stationName}</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* 요일/토글 */}
            <View style={styles.controls}>
                {['weekday', 'saturday', 'holiday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]}
                        onPress={() => setSelectedDay(day)}
                    >
                        <Text style={selectedDay === day ? styles.dayTextActive : styles.dayText}>
                            {day === 'weekday' ? '평일' : day === 'saturday' ? '토요일' : '공휴일'}
                        </Text>
                    </TouchableOpacity>
                ))}
                <View style={styles.checkboxWrap}>
                    {['shuttle', 'bus'].map(key => (
                        <TouchableOpacity
                            key={key}
                            style={styles.checkbox}
                            onPress={() => toggleCheckbox(key)}
                        >
                            <View style={[styles.box, checkboxes[key] && styles.boxChecked]}>
                                {checkboxes[key] && <Text style={styles.check}>✓</Text>}
                            </View>
                            <Text style={styles.boxLabel}>
                                {key === 'shuttle' ? '셔틀' : '시내버스'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* 타임테이블 - 가로 스크롤 + 커스텀 스크롤바 */}
            <View style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onContentSizeChange={w => setContentWidth(w)}
                    onLayout={e => setScrollAreaWidth(e.nativeEvent.layout.width)}
                    onScroll={onTableScroll}
                    scrollEventThrottle={16}
                >
                    <ScrollView style={{ height: screenHeight * 0.6 }}>
                        {/* 셔틀 줄 */}
                        {checkboxes.shuttle && timeTableData.filter(i => i.shuttle).map(i => (
                            <View key={'S' + i.time} style={styles.row}>
                                <Text style={styles.time}>{i.time}</Text>
                                <View style={styles.shuttleBox}>
                                    <Text>셔틀</Text>
                                </View>
                            </View>
                        ))}
                        {/* 버스 줄 */}
                        {checkboxes.bus && timeTableData.flatMap(i => i.buses.map(b => (
                            <View key={'B' + b + i.time} style={styles.row}>
                                <Text style={styles.time}>{i.time}</Text>
                                <View style={styles.busBox}>
                                    <Text>{b}</Text>
                                </View>
                            </View>
                        )))}
                    </ScrollView>
                </ScrollView>
                {/* 스크롤바 */}
                <View style={styles.scrollBarContainer} {...panResponder.panHandlers}>
                    <View style={styles.track} />
                    <Animated.View style={[styles.thumb, { transform: [{ translateX: pan }] }]} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#a72020',
    },
    backIcon: { color: '#fff', fontSize: 24 },
    title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    dayBtn: {
        padding: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#a72020',
        borderRadius: 6,
    },
    dayBtnActive: { backgroundColor: '#a72020' },
    dayText: { color: '#333' },
    dayTextActive: { color: '#fff' },
    checkboxWrap: { flexDirection: 'row', marginLeft: 'auto' },
    checkbox: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
    box: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#a72020',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxChecked: { backgroundColor: '#a72020' },
    check: { color: '#fff' },
    boxLabel: { marginLeft: 4, fontSize: 14, color: '#666' },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    time: { width: 60, textAlign: 'right', marginRight: 12 },
    shuttleBox: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        padding: 4,
        marginRight: 6,
    },
    busBox: {
        borderWidth: 1,
        borderColor: '#3cb371',
        borderRadius: 6,
        padding: 4,
        marginRight: 6,
    },
    scrollBarContainer: { height: 8, margin: 8 },
    track: { ...StyleSheet.absoluteFill, backgroundColor: '#ddd' },
    thumb: {
        width: 80,
        height: 8,
        backgroundColor: '#a72020',
        position: 'absolute',
        left: 0,
    },
});
