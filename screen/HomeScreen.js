import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Animated,
    PanResponder,
    Image,
} from 'react-native';

export default function HomeScreen() {
    const stations = ['아산캠퍼스', '아산역', '쌍용', '충무병원', '천안역', '천안터미널', '천안캠퍼스'];
    const scrollViewRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const pan = useRef(new Animated.Value(0)).current;
    const panValue = useRef(0);

    const [scrollAreaWidth, setScrollAreaWidth] = useState(1);
    const [contentWidth, setContentWidth] = useState(1);

    const maxScrollBarMove = Math.max(scrollAreaWidth - 100, 1);
    const totalScrollWidth = Math.max(contentWidth - scrollAreaWidth, 1);

    pan.addListener(({ value }) => {
        panValue.current = value;
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                let newX = gesture.dx + panValue.current;
                newX = Math.max(0, Math.min(newX, maxScrollBarMove));
                pan.setValue(newX);

                const scrollRatio = newX / maxScrollBarMove;
                const newScrollX = scrollRatio * totalScrollWidth;
                scrollViewRef.current?.scrollTo({ x: newScrollX, animated: false });
            },
        })
    ).current;

    const handleScroll = (event) => {
        const x = event.nativeEvent.contentOffset.x;
        const ratio = Math.max(0, Math.min(1, x / totalScrollWidth));
        const barX = ratio * maxScrollBarMove;
        pan.setValue(barX);
    };

    return (
        <View style={styles.container}>
            {/* 상단 바 */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.menuBtn}>
                    <Text style={styles.menuIcon}>≡</Text>
                </TouchableOpacity>
                <Image
                    source={require('../assets/hoseobus.png')} // 이미지 경로에 맞게 수정
                    style={styles.logoImage}
                    resizeMode="contain"
                />
                <View style={{ width: 40 }} />
            </View>

            {/* 경로 정보 */}
            <View style={styles.routeInfo}>
                <View style={styles.recentRoute}>
                    <Text style={styles.recentTitle}>최근 경로</Text>
                    <Text style={styles.routeText}>아산 → 아산역</Text>
                </View>
                <View style={styles.departureBox}>
                    <Text style={styles.departText}>출발 아산</Text>
                    <Text style={styles.departText}>도착 천안</Text>
                </View>
            </View>

            {/* 현재 위치 및 다음 버스 */}
            <View style={styles.busInfo}>
                <View style={styles.busInner}>
                    <Text style={styles.busLabel}>현재 위치</Text>
                    <Text style={styles.busValue}>아캠</Text>
                </View>
                <View style={styles.busInner}>
                    <Text style={styles.busLabel}>다음 버스</Text>
                    <View style={styles.shuttleBox}>
                        <Text style={styles.shuttleTime}>3분 뒤</Text>
                        <Text style={styles.shuttleBtn}>셔틀</Text>
                    </View>
                </View>
            </View>

            {/* 역 목록 스크롤 */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollArea}
                horizontal
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={(w) => setContentWidth(w)}
                onLayout={(e) => setScrollAreaWidth(e.nativeEvent.layout.width)}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {stations.map((station, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.stationBtn}
                        onPress={() => Alert.alert(`${station} 눌림`)}
                    >
                        <Text style={styles.stationText}>{station}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* 스크롤 바 */}
            <View style={styles.scrollLineContainer}>
                <View style={styles.scrollLineTrack} {...panResponder.panHandlers}>
                    <Animated.View
                        style={[
                            styles.scrollLineThumb,
                            {
                                transform: [
                                    {
                                        translateX: pan,
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
            </View>

            {/* 하단 버튼 */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('길찾기')}>
                    <Text style={styles.actionText}>길찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('즐겨찾기')}>
                    <Text style={styles.actionText}>즐겨찾기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },
    topBar: {
        height: 80,
        backgroundColor: '#a72020',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    logoImage: {
        width: 60,
        height: 50,
    },
    menuBtn: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        color: 'white',
        fontSize: 36,
    },
    routeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    recentRoute: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '65%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    recentTitle: {
        color: 'gray',
        fontSize: 16,
        marginBottom: 8,
    },
    routeText: {
        fontSize: 22,
        fontWeight: '600',
    },
    departureBox: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        width: '30%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    departText: {
        fontSize: 16,
        marginVertical: 4,
    },
    busInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 18,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    busInner: {
        flex: 1,
    },
    busLabel: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 6,
    },
    busValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    shuttleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shuttleTime: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    shuttleBtn: {
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontSize: 16,
        color: '#666',
    },
    scrollArea: {
        paddingLeft: 15,
        paddingVertical: 15,
        maxHeight: 110,
    },
    stationBtn: {
        borderWidth: 3,
        borderColor: '#a72020',
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginRight: 15,
        backgroundColor: 'white',
    },
    stationText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollLineContainer: {
        height: 30,
        marginHorizontal: 30,
        justifyContent: 'center',
    },
    scrollLineTrack: {
        height: 8,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    scrollLineThumb: {
        width: 100,
        height: 8,
        backgroundColor: '#a72020',
        borderRadius: 5,
        position: 'absolute',
        left: 0,
    },
    bottomButtons: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
        paddingBottom: 20,
        gap: 15,
        flex: 1,
    },
    actionBtn: {
        backgroundColor: 'white',
        paddingVertical: 30,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    actionText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
