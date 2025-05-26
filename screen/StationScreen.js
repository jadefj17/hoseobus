import React, { useState, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
SafeAreaView,
Dimensions,
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
{ time: '08:20', shuttle: true, buses: [] },
{ time: '08:40', shuttle: false, buses: ['순환5번'] },
{ time: '08:45', shuttle: true, buses: ['1000번'] },
{ time: '09:00', shuttle: true, buses: [] },
{ time: '09:15', shuttle: true, buses: [] },
{ time: '09:30', shuttle: true, buses: [] },
{ time: '09:45', shuttle: false, buses: ['500번'] },
{ time: '10:00', shuttle: true, buses: [] },
];

const [selectedDay, setSelectedDay] = useState('weekday');
const [checkboxes, setCheckboxes] = useState({ shuttle: true, bus: true });
const [timeTableData, setTimeTableData] = useState([]);
const screenHeight = Dimensions.get('window').height;

useEffect(() => {
// 백엔드 준비 전 더미 데이터 로드
setTimeTableData(dummyData);
}, [selectedDay]);

const toggleCheckbox = key => {
setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
};

return (
<SafeAreaView style={styles.container}>
    <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{stationName}</Text>
    <View style={{ width: 24 }} />
    </View>

    <View style={styles.daySelector}>
    <TouchableOpacity
        style={[styles.dayTab, selectedDay === 'weekday' && styles.dayTabActive]}
        onPress={() => setSelectedDay('weekday')}
    >
        <Text style={selectedDay === 'weekday' ? styles.dayTabTextActive : styles.dayTabText}>평일</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={[styles.dayTab, selectedDay === 'saturday' && styles.dayTabActive]}
        onPress={() => setSelectedDay('saturday')}
    >
        <Text style={selectedDay === 'saturday' ? styles.dayTabTextActive : styles.dayTabText}>토요일</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={[styles.dayTab, selectedDay === 'holiday' && styles.dayTabActive]}
        onPress={() => setSelectedDay('holiday')}
    >
        <Text style={selectedDay === 'holiday' ? styles.dayTabTextActive : styles.dayTabText}>공휴일</Text>
    </TouchableOpacity>

    <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleCheckbox('shuttle')}>
        <View style={[styles.checkboxBox, checkboxes.shuttle && styles.checkboxChecked]}>
            {checkboxes.shuttle && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>셔틀</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleCheckbox('bus')}>
        <View style={[styles.checkboxBox, checkboxes.bus && styles.checkboxChecked]}>
            {checkboxes.bus && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>시내버스</Text>
        </TouchableOpacity>
    </View>
    </View>

    <ScrollView style={[styles.timeTableContainer, { height: screenHeight * 0.6 }]}>      
    {/* 셔틀 타임테이블 */}
    {checkboxes.shuttle && (
        timeTableData
        .filter(item => item.shuttle)
        .map(item => (
            <View key={`shuttle-${item.time}`} style={styles.timeRow}>
            <Text style={styles.timeText}>{item.time}</Text>
            <View style={styles.shuttleButton}>
                <Text style={styles.shuttleText}>셔틀</Text>
            </View>
            </View>
        ))
    )}

    {/* 시내버스 타임테이블 */}
    {checkboxes.bus && (
        timeTableData
        .filter(item => item.buses.length > 0)
        .flatMap(item =>
            item.buses.map(bus => (
            <View key={`bus-${bus}-${item.time}`} style={styles.timeRow}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={styles.busButton}>
                <Text style={styles.busText}>{bus}</Text>
                </View>
            </View>
            ))
        )
    )}
    </ScrollView>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        height: 56,
        backgroundColor: '#a72020',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backIcon: { color: 'white', fontSize: 24 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },

    daySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 4,
    },
    dayTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#a72020',
        marginRight: 8,
    },
    dayTabActive: { backgroundColor: '#a72020' },
    dayTabText: { color: '#333', fontSize: 14 },
    dayTabTextActive: { color: '#fff', fontSize: 14 },

    checkboxContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignItems: 'center',
    },
    checkbox: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
    checkboxBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#a72020',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: { backgroundColor: '#a72020' },
    checkmark: { color: '#fff', fontSize: 14 },
    checkboxLabel: { marginLeft: 4, fontSize: 14, color: '#666' },

    timeTableContainer: { backgroundColor: '#fff', marginHorizontal: 8, borderRadius: 6 },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    timeText: {
        width: 60,
        fontSize: 16,
        color: '#555',
        textAlign: 'right',
        marginRight: 12,
    },
    shuttleButton: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
    },
    shuttleText: { fontSize: 14, color: '#666' },
        busButton: {
        borderWidth: 1,
        borderColor: '#3cb371',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
    },
    busText: { fontSize: 14, color: '#3cb371' },
});
