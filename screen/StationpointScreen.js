import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    PanResponder,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StationpointScreen() {
    const navigation = useNavigation();
    const windowHeight = Dimensions.get('window').height;

    const stations = [
        { name: '아산캠퍼스', time: '8:00 ~ 21:30' },
        { name: '천안아산역', time: '8:13 ~ 21:30' },
        { name: '용암마을', time: '8:20 ~ 21:30' },
        { name: '충무병원', time: '8:30 ~ 21:30' },
        { name: '천안역', time: '8:45 ~ 21:30' },
        { name: '천안터미널', time: '8:47 ~ 21:30' },
        { name: '천안캠퍼스', time: '8:53 ~ 21:30' },
    ];

    const [selectedStation, setSelectedStation] = useState('천안아산역');
    const sheetHeight = windowHeight * 0.45;
    const pan = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > -sheetHeight && gestureState.dy < 400) {
                    pan.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -50) {
                    Animated.spring(pan, {
                        toValue: -sheetHeight + 100,
                        useNativeDriver: false,
                    }).start();
                } else if (gestureState.dy > 100) {
                    Animated.spring(pan, {
                        toValue: 300,
                        useNativeDriver: false,
                    }).start();
                } else {
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const sheetTranslateY = pan.interpolate({
        inputRange: [-sheetHeight + 100, 300],
        outputRange: [-sheetHeight + 100, 300],
        extrapolate: 'clamp',
    });

    const mapHeight = pan.interpolate({
        inputRange: [-sheetHeight + 100, 300],
        outputRange: [100, 250],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            {/* 상단 빨간 바 */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Image source={require('../assets/hoseobus.png')} style={styles.logo} />
                <View style={{ width: 24 }} />
            </View>

            <Animated.View style={[styles.mapPlaceholder, { height: mapHeight }]}>
                <Text style={{ color: '#aaa' }}>[ 지도 ]</Text>
            </Animated.View>

            <Animated.View
                {...panResponder.panHandlers}
                style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
            >
                <View style={styles.sheetHeader}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.selectionTitle}>탑승 위치 선택</Text>
                </View>
                <ScrollView style={{ maxHeight: sheetHeight - 60 }}>
                    {stations.map((station, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.stationRow}
                            onPress={() => setSelectedStation(station.name)}
                        >
                            <View style={styles.radioContainer}>
                                <View
                                    style={[
                                        styles.radioCircle,
                                        selectedStation === station.name && styles.radioSelected,
                                    ]}
                                />
                            </View>
                            <Text style={styles.stationName}>{station.name}</Text>
                            <Text style={styles.timeText}>{station.time}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    topBar: {
        height: 100,
        backgroundColor: '#a72020',
        //justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    logo: { width: 50, height: 50 },
    backIcon: { color: '#fff', fontSize: 28 },
    mapPlaceholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    sheetHeader: {
        alignItems: 'center',
        marginBottom: 10,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    selectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    stationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    radioContainer: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#a72020',
    },
    radioSelected: {
        backgroundColor: '#a72020',
    },
    stationName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    timeText: {
        fontSize: 14,
        color: '#444',
    },
});
