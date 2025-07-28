import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    const stations = ['아산캠퍼스', '아산역', '쌍용2동', '충무 병원', '천안역', '천안터미널', '천안캠퍼스'];
    const scrollViewRef = useRef(null);
    const indicatorAnim = useRef(new Animated.Value(0)).current;

    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const maxScroll = contentSize.width - layoutMeasurement.width;
        const ratio = contentOffset.x / maxScroll;
        const maxIndicatorMove = layoutMeasurement.width - 60; // 60 = indicator width
        const newX = ratio * maxIndicatorMove;

        Animated.timing(indicatorAnim, {
            toValue: newX,
            duration: 0,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* 상단 바 */}
            <View style={styles.topBar}>
                <Image source={require('../assets/hoseobus.png')} style={styles.logo} />
            </View>

            {/* 정류장 탭 */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContainer}
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {stations.map((station) => (
                    <TouchableOpacity
                        key={station}
                        style={[styles.tab, styles.tabUnselected]}
                        onPress={() => {
                            navigation.navigate('Station', { stationName: station });
                        }}
                    >
                        <Text style={styles.tabTextUnselected}>{station}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* 탭 하단 빨간선 (스크롤바 역할) */}
            <View style={styles.tabScrollBarTrack}>
                <Animated.View style={[styles.tabScrollBarThumb, { left: indicatorAnim }]} />
            </View>

            {/* 현재 위치 및 셔틀 */}
            <View style={styles.locationBox}>
                <View style={styles.locationLeft}>
                    <Text style={styles.locationTitle}>📍 현재 위치</Text>
                    <Text style={styles.locationText}>아산캠퍼스</Text>
                </View>
                <View style={styles.shuttleTimes}>
                    <View style={styles.shuttleRow}>
                        <Text style={styles.shuttleLabel}>셔틀</Text>
                        <Text style={styles.shuttleTime}>3분 53초</Text>
                    </View>
                    <View style={styles.shuttleRow}>
                        <Text style={styles.shuttleLabel}>셔틀</Text>
                        <Text style={styles.shuttleTime}>13분 53초</Text>
                    </View>
                </View>
            </View>

            {/* 최근 경로 */}
            <View style={styles.historySection}>
                <Text style={styles.historyTitle}>최근 경로</Text>
                <View style={styles.historyRow}>
                    <Text style={styles.shuttleLabelOutline}>셔틀</Text>
                    <Text style={styles.historyText}>아산캠퍼스 → 아산역</Text>
                </View>
                <View style={styles.historyTag}>
                    <Text style={styles.historySmall}>아캠 ↔ 천캠</Text>
                </View>
            </View>

            {/* 하단 버튼 */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Stationpoint')}>
                    <Text style={styles.menuIcon}>🚌</Text>
                    <Text style={styles.menuText}>정류장</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Favorite')}>
                    <Text style={styles.menuIcon}>⭐</Text>
                    <Text style={styles.menuText}>즐겨찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuIcon}>📢</Text>
                    <Text style={styles.menuText}>공지</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eee' },
    topBar: {
        height: 100,
        backgroundColor: '#a72020',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: { width: 50, height: 50 },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#eee',
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 15,
        gap: 15,
        height: 70,
        marginBottom: 20,
    },
    tab: {
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 5,
        justifyContent: 'center',
        height: 60,
    },
    tabSelected: { backgroundColor: '#a72020', borderColor: '#a72020' },
    tabUnselected: { backgroundColor: '#fff', borderColor: '#a72020' },
    tabTextSelected: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    tabTextUnselected: { color: '#a72020', fontWeight: 'bold', fontSize: 12 },
    tabScrollBarTrack: {
        height: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 30,
        overflow: 'hidden',
    },
    tabScrollBarThumb: {
        position: 'absolute',
        width: 60,
        height: 5,
        backgroundColor: '#a72020',
        borderRadius: 10,
    },
    locationBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    locationLeft: {},
    locationTitle: { fontSize: 18, color: 'gray', marginBottom: 5 },
    locationText: { fontSize: 24, fontWeight: 'bold' },
    shuttleTimes: {},
    shuttleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    shuttleLabel: {
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 10,
        fontSize: 14,
    },
    shuttleTime: { fontSize: 18 },
    historySection: { marginHorizontal: 20, marginBottom: 40 },
    historyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
    },
    shuttleLabelOutline: {
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 10,
        fontSize: 14,
    },
    historyText: { fontSize: 16 },
    historyTag: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    historySmall: { fontSize: 14 },
    bottomMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 35,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 40,
    },
    menuButton: { alignItems: 'center' },
    menuIcon: { fontSize: 26, color: '#a72020', marginBottom: 5 },
    menuText: { color: '#a72020', fontWeight: 'bold' },
});
