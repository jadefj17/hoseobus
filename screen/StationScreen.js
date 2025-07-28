import React, { useState, useEffect, useRef } from 'react';
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
import { DatePickerModal } from 'react-native-paper-dates';
import { Provider as PaperProvider } from 'react-native-paper';
import { ko } from 'date-fns/locale';

const getFormattedDate = (date) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

export default function StationScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const initialStations = route.params?.selectedStations || [];
  const [stationName, setStationName] = useState(initialStations.join(' → ') || '정류장');
  const stations = ['아산캠퍼스', '아산역', '쌍용', '충무병원', '천안역', '천안터미널', '천안캠퍼스'];
  const scrollViewRef = useRef(null);
  const [scrollAreaWidth, setScrollAreaWidth] = useState(1);
  const [contentWidth, setContentWidth] = useState(1);
  const [selectedStations, setSelectedStations] = useState(initialStations);

  const dummyData = [
    { time: '08:00', shuttle: true, buses: [] },
    { time: '08:10', shuttle: true, buses: [] },
    { time: '08:40', shuttle: false, buses: ['순환5번'] },
    { time: '08:45', shuttle: true, buses: ['1000번'] },
    { time: '09:00', shuttle: true, buses: [] },
    { time: '09:45', shuttle: false, buses: ['500번'] },
    { time: '10:00', shuttle: true, buses: [] },
  ];

  const [checkboxes, setCheckboxes] = useState({ shuttle: true, bus: true });
  const [timeTableData, setTimeTableData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const reloadTimetable = () => {
    setTimeTableData(dummyData);
  };

  useEffect(() => {
    setTimeTableData(dummyData);
  }, []);

  const toggleCheckbox = (key) => setCheckboxes((p) => ({ ...p, [key]: !p[key] }));

  const screenHeight = Dimensions.get('window').height;

  const handleStationPress = (station) => {
    let updated = [...selectedStations];
    if (updated.includes(station)) {
      updated = updated.filter((s) => s !== station);
    } else {
      if (updated.length < 2) {
        updated.push(station);
      } else {
        updated = [updated[1], station];
      }
    }
    setSelectedStations(updated);
    setStationName(updated.join(' → ') || '정류장');
  };

  return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
                onPress={() => {
                  setSelectedStations([]);
                  setStationName('정류장');
                  navigation.goBack();
                }}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{stationName}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
              ref={scrollViewRef}
              style={styles.scrollArea}
              horizontal
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={(w) => setContentWidth(w)}
              onLayout={(e) => setScrollAreaWidth(e.nativeEvent.layout.width)}
              scrollEventThrottle={16}
          >
            {stations.map((station, i) => (
                <TouchableOpacity
                    key={i}
                    style={[styles.stationBtn, selectedStations.includes(station) && { backgroundColor: '#a72020' }]}
                    onPress={() => handleStationPress(station)}
                >
                  <Text style={[styles.stationText, selectedStations.includes(station) && { color: 'white' }]}>{station}</Text>
                </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => setOpen(true)} style={styles.calendarBtn}>
              <Text style={styles.calendarText}>{getFormattedDate(date)}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={reloadTimetable} style={styles.reloadBtn}>
              <Text style={styles.reloadText}>↻</Text>
            </TouchableOpacity>

            <View style={styles.checkboxWrap}>
              {['shuttle', 'bus'].map((key) => (
                  <TouchableOpacity key={key} style={styles.checkbox} onPress={() => toggleCheckbox(key)}>
                    <View style={[styles.box, checkboxes[key] && styles.boxChecked]}>
                      {checkboxes[key] && <Text style={styles.check}>✓</Text>}
                    </View>
                    <Text style={styles.boxLabel}>{key === 'shuttle' ? '셔틀' : '시내버스'}</Text>
                  </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.notice}>⚠️ 5분 이상 지연 예상 시 노란색으로 표시됩니다.</Text>

          <View style={{ flex: 1 }}>
            <ScrollView style={{ height: screenHeight * 0.6 }}>
              {timeTableData.map((item) => {
                if (!(item.shuttle && checkboxes.shuttle) && !(item.buses.length && checkboxes.bus)) return null;
                return (
                    <View key={item.time} style={styles.row}>
                      <Text style={styles.time}>{item.time}</Text>
                      {item.shuttle && checkboxes.shuttle && (
                          <View style={styles.shuttleBox}>
                            <Text>셔틀</Text>
                          </View>
                      )}
                      {checkboxes.bus &&
                          item.buses.map((bus) => (
                              <View key={bus + item.time} style={styles.busBox}>
                                <Text>{bus}</Text>
                              </View>
                          ))}
                    </View>
                );
              })}
            </ScrollView>
          </View>

          <DatePickerModal
              locale="ko"
              mode="single"
              visible={open}
              onDismiss={() => setOpen(false)}
              date={date}
              onConfirm={(params) => {
                if (params.date) {
                  setDate(params.date);
                }
                setOpen(false);
              }}
          />
        </SafeAreaView>
      </PaperProvider>
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
  scrollArea: {
    paddingLeft: 12,
    paddingVertical: 4,
    backgroundColor: '#fff',
    maxHeight: 50,
  },
  stationBtn: {
    borderWidth: 2,
    borderColor: '#a72020',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  calendarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#a72020',
    borderRadius: 6,
    marginRight: 8,
  },
  calendarText: { color: '#333', fontWeight: 'bold' },
  reloadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#a72020',
    borderRadius: 6,
    marginRight: 8,
  },
  reloadText: { color: '#a72020', fontSize: 18 },
  checkboxWrap: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
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
  boxLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  notice: {
    fontSize: 13,
    fontWeight: '500',
    color: '#a72020',
    paddingLeft: 16,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  time: {
    width: 60,
    textAlign: 'right',
    marginRight: 12,
  },
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
});
