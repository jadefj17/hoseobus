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

  // Safe parameter extraction with fallback
  const stationName = route.params?.stationName || '정류장';

  // 역 목록
  const stations = ['아산캠퍼스', '아산역', '쌍용', '충무병원', '천안역', '천안터미널', '천안캠퍼스'];
  const scrollViewRef = useRef(null);
  const [scrollAreaWidth, setScrollAreaWidth] = useState(1);
  const [contentWidth, setContentWidth] = useState(1);

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

  // 타임테이블 가로 스크롤 상태
  const scrollRef = useRef(null);
  const pan = useRef(new Animated.Value(0)).current;
  const panValue = useRef(0);
  const [ttAreaWidth, setTtAreaWidth] = useState(1);
  const [ttContentWidth, setTtContentWidth] = useState(1);
  const maxThumb = Math.max(ttAreaWidth - 80, 1);
  const totalScroll = Math.max(ttContentWidth - ttAreaWidth, 1);

  // PanResponder for custom scrollbar
  pan.addListener(({ value }) => (panValue.current = value));
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        let x = g.dx + panValue.current;
        x = Math.max(0, Math.min(x, maxThumb));
        pan.setValue(x);
        const ratio = x / maxThumb;
        scrollRef.current?.scrollTo({ x: ratio * totalScroll, animated: false });
      },
    })
  ).current;

  useEffect(() => {
    setTimeTableData(dummyData);
  }, [selectedDay]);

  const toggleCheckbox = key => setCheckboxes(p => ({ ...p, [key]: !p[key] }));
  const onTableScroll = e => {
    const x = e.nativeEvent.contentOffset.x;
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

      {/* 역 목록 스크롤 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollArea}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={w => setContentWidth(w)}
        onLayout={e => setScrollAreaWidth(e.nativeEvent.layout.width)}
        scrollEventThrottle={16}
      >
        {stations.map((station, i) => (
          <TouchableOpacity
            key={i}
            style={styles.stationBtn}
            onPress={() => navigation.navigate('Station', { stationName: station })}
          >
            <Text style={styles.stationText}>{station}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
            <TouchableOpacity key={key} style={styles.checkbox} onPress={() => toggleCheckbox(key)}>
              <View style={[styles.box, checkboxes[key] && styles.boxChecked]}>
                {checkboxes[key] && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={styles.boxLabel}>{key === 'shuttle' ? '셔틀' : '시내버스'}</Text>
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
          onContentSizeChange={w => setTtContentWidth(w)}
          onLayout={e => setTtAreaWidth(e.nativeEvent.layout.width)}
          onScroll={onTableScroll}
          scrollEventThrottle={16}
        >
          <ScrollView style={{ height: screenHeight * 0.6 }}>
            {timeTableData.map(item => {
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
                    item.buses.map(bus => (
                      <View key={bus + item.time} style={styles.busBox}>
                        <Text>{bus}</Text>
                      </View>
                    ))}
                </View>
              );
            })}
          </ScrollView>
        </ScrollView>
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

  scrollArea: { 
    paddingLeft: 12, 
    paddingVertical: 4, 
    backgroundColor: '#fff',
    maxHeight: 50
  },
  stationBtn: {
    borderWidth: 2,
    borderColor: '#a72020',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: 'white',
  },
  stationText: { 
    color: '#000', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },

  controls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#fff' 
  },
  dayBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#a72020',
    borderRadius: 6,
    marginRight: 8,
  },
  dayBtnActive: { backgroundColor: '#a72020' },
  dayText: { color: '#333' },
  dayTextActive: { color: '#fff' },

  checkboxWrap: { 
    flexDirection: 'row', 
    marginLeft: 'auto' 
  },
  checkbox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 12 
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
    color: '#666' 
  },

  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderBottomWidth: 0.5, 
    borderColor: '#eee' 
  },
  time: { 
    width: 60, 
    textAlign: 'right', 
    marginRight: 12 
  },
  shuttleBox: { 
    borderWidth: 1, 
    borderColor: '#aaa', 
    borderRadius: 6, 
    padding: 4, 
    marginRight: 6 
  },
  busBox: { 
    borderWidth: 1, 
    borderColor: '#3cb371', 
    borderRadius: 6, 
    padding: 4, 
    marginRight: 6 
  },

  scrollBarContainer: { height: 8, margin: 8 },
  track: { ...StyleSheet.absoluteFill, backgroundColor: '#ddd' },
  thumb: { 
    width: 80, 
    height: 8, 
    backgroundColor: '#a72020', 
    position: 'absolute', 
    left: 0 
  },
});
