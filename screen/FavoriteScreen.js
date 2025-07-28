import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FavoriteScreen() {
    const navigation = useNavigation();

    const handleRoutePress = (from, to) => {
        navigation.navigate('Station', { selectedStations: [from, to] });
    };

    const handleStationPress = (station) => {
        navigation.navigate('Station', { selectedStations: [station] });
    };

    return (
        <View style={styles.container}>
            {/* 상단 빨간 바 */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.menuIcon}>←</Text>
                </TouchableOpacity>
                <Image
                    source={require('../assets/hoseobus.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
                <View style={{ width: 40 }} />
            </View>

            {/* 경로 박스 */}
            <View style={styles.box}>
                <Text style={styles.title}>자주 이용하는 경로</Text>
                <View style={styles.divider} />

                <TouchableOpacity onPress={() => handleRoutePress('아산캠퍼스', '아산역')}>
                    <Text style={styles.route}>아산캠퍼스 → 아산역</Text>
                </TouchableOpacity>
                <View style={styles.divider} />

                <TouchableOpacity onPress={() => handleRoutePress('아산역', '아산캠퍼스')}>
                    <Text style={styles.route}>아산역 → 아산캠퍼스</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>

            {/* 역 박스 */}
            <View style={styles.box}>
                <Text style={styles.title}>자주 이용하는 역</Text>
                <View style={styles.divider} />

                <TouchableOpacity onPress={() => handleStationPress('아산역')}>
                    <View style={styles.stationRow}>
                        <Text style={styles.star}>★</Text>
                        <Text style={styles.station}>아산역</Text>
                        <Text style={styles.time}>10:00</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />

                <TouchableOpacity onPress={() => handleStationPress('아산캠퍼스')}>
                    <View style={styles.stationRow}>
                        <Text style={styles.star}>★</Text>
                        <Text style={styles.station}>아산캠퍼스</Text>
                        <Text style={styles.time}>18:00</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        paddingTop: 150,
        paddingHorizontal: 20,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 130,
        backgroundColor: '#a72020',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        zIndex: 100,
    },
    menuIcon: {
        color: 'white',
        fontSize: 36,
    },
    logoImage: {
        width: 60,
        height: 50,
    },
    box: {
        width: '90%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 30,
        position: 'relative',
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
    },
    route: {
        fontSize: 16,
        paddingVertical: 10,
    },
    stationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    star: {
        fontSize: 18,
        color: '#000',
        marginRight: 10,
    },
    station: {
        flex: 1,
        fontSize: 16,
    },
    time: {
        color: '#888',
    },
});
