import React, { useState, useEffect, useRef } from 'react'; // React 및 React Hooks 임포트
import {
  View, // View 컴포넌트 (UI 컨테이너)
  Text, // Text 컴포넌트 (텍스트 표시)
  StyleSheet, // StyleSheet API (스타일 정의)
  TouchableOpacity, // TouchableOpacity 컴포넌트 (터치 가능한 영역)
  ScrollView, // ScrollView 컴포넌트 (스크롤 가능한 뷰)
  SafeAreaView, // SafeAreaView 컴포넌트 (안전 영역을 고려한 뷰)
  Dimensions, // Dimensions API (화면 크기 정보)
  Animated, // Animated API (애니메이션)
  PanResponder, // PanResponder API (터치 제스처 처리)
} from 'react-native'; // React Native 컴포넌트 및 API 임포트
import { useRoute, useNavigation } from '@react-navigation/native'; // React Navigation Hooks 임포트

// StationScreen 컴포넌트 정의
export default function StationScreen() {
  const route = useRoute(); // 현재 라우트 정보 가져오기
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  // 안전한 파라미터 추출 및 기본값 설정 (route.params가 없거나 stationName이 undefined일 경우 대비)
  const stationName = route.params?.stationName || '정류장'; // 현재 역 이름 또는 기본값 '정류장'

  // 역 목록 배열
  const stations = ['아산캠퍼스', '아산역', '쌍용', '충무병원', '천안역', '천안터미널', '천안캠퍼스'];
  const scrollViewRef = useRef(null); // 역 목록 스크롤뷰 참조
  const [scrollAreaWidth, setScrollAreaWidth] = useState(1); // 역 목록 스크롤 영역 너비 상태
  const [contentWidth, setContentWidth] = useState(1); // 역 목록 스크롤 콘텐츠 너비 상태

  // 샘플 더미 데이터 (시간표)
  const dummyData = [
    { time: '08:00', shuttle: true, buses: [] }, // 시간, 셔틀 여부, 버스 목록
    { time: '08:10', shuttle: true, buses: [] },
    { time: '08:40', shuttle: false, buses: ['순환5번'] },
    { time: '08:45', shuttle: true, buses: ['1000번'] },
    { time: '09:00', shuttle: true, buses: [] },
    { time: '09:45', shuttle: false, buses: ['500번'] },
    { time: '10:00', shuttle: true, buses: [] },
  ];

  const [selectedDay, setSelectedDay] = useState('weekday'); // 선택된 요일 상태 (기본값: 평일)
  const [checkboxes, setCheckboxes] = useState({ shuttle: true, bus: true }); // 체크박스 상태 (셔틀, 시내버스)
  const [timeTableData, setTimeTableData] = useState([]); // 시간표 데이터 상태

  // 타임테이블 가로 스크롤 상태
  const scrollRef = useRef(null); // 타임테이블 스크롤뷰 참조
  const pan = useRef(new Animated.Value(0)).current; // 스크롤바 핸들 애니메이션 값
  const panValue = useRef(0); // 스크롤바 핸들 현재 위치 값
  const [ttAreaWidth, setTtAreaWidth] = useState(1); // 타임테이블 스크롤 영역 너비 상태
  const [ttContentWidth, setTtContentWidth] = useState(1); // 타임테이블 스크롤 콘텐츠 너비 상태
  const maxThumb = Math.max(ttAreaWidth - 80, 1); // 스크롤바 핸들 최대 이동 가능 거리 (80은 핸들 너비)
  const totalScroll = Math.max(ttContentWidth - ttAreaWidth, 1); // 타임테이블 전체 스크롤 가능 거리

  // 커스텀 스크롤바를 위한 PanResponder 설정
  pan.addListener(({ value }) => (panValue.current = value)); // pan 값 변경 시 panValue 업데이트
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 터치 시작 시 PanResponder 활성화
      onPanResponderMove: (_, g) => { // 터치 드래그 시
        let x = g.dx + panValue.current; // 새로운 x 위치 계산 (이동 거리 + 현재 위치)
        x = Math.max(0, Math.min(x, maxThumb)); // x 위치를 0과 maxThumb 사이로 제한
        pan.setValue(x); // 애니메이션 값 업데이트
        const ratio = x / maxThumb; // 스크롤 비율 계산
        scrollRef.current?.scrollTo({ x: ratio * totalScroll, animated: false }); // 타임테이블 스크롤 이동
      },
    })
  ).current; // PanResponder 생성

  // selectedDay가 변경될 때 시간표 데이터 업데이트
  useEffect(() => {
    setTimeTableData(dummyData); // 더미 데이터를 시간표 데이터로 설정
  }, [selectedDay]); // selectedDay가 변경될 때만 실행

  // 체크박스 토글 함수
  const toggleCheckbox = key => setCheckboxes(p => ({ ...p, [key]: !p[key] })); // 이전 상태를 복사하고 해당 키의 값을 반전
  // 타임테이블 스크롤 이벤트 핸들러
  const onTableScroll = e => {
    const x = e.nativeEvent.contentOffset.x; // 현재 스크롤 위치 (x 좌표)
    const ratio = x / totalScroll; // 스크롤 비율 계산
    pan.setValue(ratio * maxThumb); // 스크롤바 핸들 위치 업데이트
  };

  const screenHeight = Dimensions.get('window').height; // 현재 화면 높이 가져오기

  // UI 렌더링
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>{/* 뒤로가기 아이콘 */}
        </TouchableOpacity>
        <Text style={styles.title}>{stationName}</Text>{/* 역 이름 표시 */}
        <View style={{ width: 24 }} />{/* 오른쪽 정렬을 위한 빈 공간 */}
      </View>

      {/* 역 목록 스크롤 */}
      <ScrollView
        ref={scrollViewRef} // 스크롤뷰 참조 연결
        style={styles.scrollArea} // 스타일 적용
        horizontal // 가로 스크롤 활성화
        showsHorizontalScrollIndicator={false} // 가로 스크롤바 숨김
        onContentSizeChange={w => setContentWidth(w)} // 콘텐츠 크기 변경 시 contentWidth 업데이트
        onLayout={e => setScrollAreaWidth(e.nativeEvent.layout.width)} // 레이아웃 변경 시 scrollAreaWidth 업데이트
        scrollEventThrottle={16} // 스크롤 이벤트 발생 빈도 (16ms)
      >
        {stations.map((station, i) => ( // 역 목록 배열 순회
          <TouchableOpacity
            key={i} // 각 항목의 고유 키
            style={styles.stationBtn} // 스타일 적용
            onPress={() => navigation.navigate('Station', { stationName: station })} // 클릭 시 해당 역 화면으로 이동
          >
            <Text style={styles.stationText}>{station}</Text>{/* 역 이름 텍스트 */}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 요일/토글 */}
      <View style={styles.controls}>
        {['weekday', 'saturday', 'holiday'].map(day => ( // 요일 배열 순회
          <TouchableOpacity
            key={day} // 각 항목의 고유 키
            style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]} // 기본 스타일 및 선택된 요일 스타일 적용
            onPress={() => setSelectedDay(day)} // 클릭 시 selectedDay 업데이트
          >
            <Text style={selectedDay === day ? styles.dayTextActive : styles.dayText}>
              {day === 'weekday' ? '평일' : day === 'saturday' ? '토요일' : '공휴일'} {/* 요일 텍스트 표시 */}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.checkboxWrap}>
          {['shuttle', 'bus'].map(key => ( // 체크박스 키 배열 순회 (셔틀, 버스)
            <TouchableOpacity key={key} style={styles.checkbox} onPress={() => toggleCheckbox(key)}>
              <View style={[styles.box, checkboxes[key] && styles.boxChecked]}>
                {checkboxes[key] && <Text style={styles.check}>✓</Text>} {/* 체크된 경우 체크 아이콘 표시 */}
              </View>
              <Text style={styles.boxLabel}>{key === 'shuttle' ? '셔틀' : '시내버스'}</Text>{/* 체크박스 라벨 */}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 타임테이블 - 가로 스크롤 + 커스텀 스크롤바 */}
      <View style={{ flex: 1 }}>{/* 남은 공간 모두 차지 */}
        <ScrollView
          ref={scrollRef} // 스크롤뷰 참조 연결
          horizontal // 가로 스크롤 활성화
          showsHorizontalScrollIndicator={false} // 가로 스크롤바 숨김
          onContentSizeChange={w => setTtContentWidth(w)} // 콘텐츠 크기 변경 시 ttContentWidth 업데이트
          onLayout={e => setTtAreaWidth(e.nativeEvent.layout.width)} // 레이아웃 변경 시 ttAreaWidth 업데이트
          onScroll={onTableScroll} // 스크롤 이벤트 발생 시 onTableScroll 호출
          scrollEventThrottle={16} // 스크롤 이벤트 발생 빈도
        >
          <ScrollView style={{ height: screenHeight * 0.6 }}>{/* 내부 스크롤뷰 (세로), 화면 높이의 60% */}
            {timeTableData.map(item => { // 시간표 데이터 배열 순회
              // 셔틀이 선택되었고 현재 항목이 셔틀이거나, 버스가 선택되었고 현재 항목에 버스가 있는 경우에만 표시
              if (!(item.shuttle && checkboxes.shuttle) && !(item.buses.length && checkboxes.bus)) return null;
              return (
                <View key={item.time} style={styles.row}>{/* 각 시간표 항목 행 */}
                  <Text style={styles.time}>{item.time}</Text>{/* 시간 표시 */}
                  {item.shuttle && checkboxes.shuttle && ( // 셔틀이 있고 셔틀 체크박스가 선택된 경우
                    <View style={styles.shuttleBox}>
                      <Text>셔틀</Text>{/* "셔틀" 텍스트 표시 */}
                    </View>
                  )}
                  {checkboxes.bus && // 버스 체크박스가 선택된 경우
                    item.buses.map(bus => ( // 버스 목록 배열 순회
                      <View key={bus + item.time} style={styles.busBox}>{/* 각 버스 항목 */}
                        <Text>{bus}</Text>{/* 버스 번호 표시 */}
                      </View>
                    ))}
                </View>
              );
            })}
          </ScrollView>
        </ScrollView>
        {/* 커스텀 스크롤바 */}
        <View style={styles.scrollBarContainer} {...panResponder.panHandlers}>{/* PanResponder 이벤트 핸들러 연결 */}
          <View style={styles.track} />{/* 스크롤바 트랙 */}
          <Animated.View style={[styles.thumb, { transform: [{ translateX: pan }] }]} />{/* 스크롤바 핸들 (애니메이션 적용) */}
        </View>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }, // 전체 컨테이너: 화면 전체 차지, 배경색 회색
  header: { // 헤더 스타일
    height: 56, // 높이
    flexDirection: 'row', // 자식 요소 가로 정렬
    alignItems: 'center', // 자식 요소 세로 중앙 정렬
    justifyContent: 'space-between', // 자식 요소 양쪽 끝 정렬
    padding: 16, // 내부 여백
    backgroundColor: '#a72020', // 배경색 (진홍색)
  },
  backIcon: { color: '#fff', fontSize: 24 }, // 뒤로가기 아이콘: 흰색, 글자 크기 24
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, // 제목: 흰색, 글자 크기 18, 굵게

  scrollArea: {  // 역 목록 스크롤 영역 스타일
    paddingLeft: 12, // 왼쪽 내부 여백
    paddingVertical: 4,  // 위아래 내부 여백
    backgroundColor: '#fff', // 배경색 흰색
    maxHeight: 50 // 최대 높이 50
  },
  stationBtn: { // 역 버튼 스타일
    borderWidth: 2, // 테두리 두께
    borderColor: '#a72020', // 테두리 색 (진홍색)
    borderRadius: 20, // 테두리 둥글게
    paddingVertical: 6, // 위아래 내부 여백
    paddingHorizontal: 16, // 좌우 내부 여백
    marginRight: 8, // 오른쪽 외부 여백
    backgroundColor: 'white', // 배경색 흰색
    justifyContent: 'center', // 내부 콘텐츠 세로 중앙 정렬
    alignItems: 'center', // 내부 콘텐츠 가로 중앙 정렬
  },
  stationText: {  // 역 버튼 텍스트 스타일
    color: '#000',  // 글자색 검정
    fontSize: 14,  // 글자 크기 14
    fontWeight: 'bold', // 글자 굵게
    textAlign: 'center' // 텍스트 중앙 정렬
  },

  controls: {  // 요일 및 체크박스 컨트롤 영역 스타일
    flexDirection: 'row', // 자식 요소 가로 정렬
    alignItems: 'center', // 자식 요소 세로 중앙 정렬
    padding: 10, // 내부 여백
    backgroundColor: '#fff' // 배경색 흰색
  },
  dayBtn: { // 요일 버튼 스타일
    paddingVertical: 6, // 위아래 내부 여백
    paddingHorizontal: 12, // 좌우 내부 여백
    borderWidth: 1, // 테두리 두께
    borderColor: '#a72020', // 테두리 색 (진홍색)
    borderRadius: 6, // 테두리 둥글게
    marginRight: 8, // 오른쪽 외부 여백
  },
  dayBtnActive: { backgroundColor: '#a72020' }, // 활성화된 요일 버튼: 배경색 (진홍색)
  dayText: { color: '#333' }, // 요일 버튼 텍스트: 글자색 어두운 회색
  dayTextActive: { color: '#fff' }, // 활성화된 요일 버튼 텍스트: 글자색 흰색

  checkboxWrap: {  // 체크박스 그룹 래퍼 스타일
    flexDirection: 'row', // 자식 요소 가로 정렬
    marginLeft: 'auto' // 왼쪽 외부 여백 자동 (오른쪽으로 밀착)
  },
  checkbox: {  // 개별 체크박스 스타일
    flexDirection: 'row', // 자식 요소 가로 정렬
    alignItems: 'center', // 자식 요소 세로 중앙 정렬
    marginLeft: 12 // 왼쪽 외부 여백
  },
  box: { // 체크박스 박스 스타일
    width: 20, // 너비
    height: 20, // 높이
    borderWidth: 1, // 테두리 두께
    borderColor: '#a72020', // 테두리 색 (진홍색)
    justifyContent: 'center', // 내부 콘텐츠 세로 중앙 정렬
    alignItems: 'center', // 내부 콘텐츠 가로 중앙 정렬
  },
  boxChecked: { backgroundColor: '#a72020' }, // 체크된 박스: 배경색 (진홍색)
  check: { color: '#fff' }, // 체크 아이콘: 흰색
  boxLabel: {  // 체크박스 라벨 스타일
    marginLeft: 4, // 왼쪽 외부 여백
    fontSize: 14, // 글자 크기
    color: '#666' // 글자색 회색
  },

  row: {  // 시간표 각 행 스타일
    flexDirection: 'row', // 자식 요소 가로 정렬
    alignItems: 'center', // 자식 요소 세로 중앙 정렬
    padding: 10, // 내부 여백
    borderBottomWidth: 0.5, // 아래쪽 테두리 두께
    borderColor: '#eee' // 아래쪽 테두리 색 (연한 회색)
  },
  time: {  // 시간 텍스트 스타일
    width: 60, // 너비
    textAlign: 'right', // 텍스트 오른쪽 정렬
    marginRight: 12 // 오른쪽 외부 여백
  },
  shuttleBox: {  // 셔틀 정보 박스 스타일
    borderWidth: 1, // 테두리 두께
    borderColor: '#aaa', // 테두리 색 (회색)
    borderRadius: 6, // 테두리 둥글게
    padding: 4, // 내부 여백
    marginRight: 6 // 오른쪽 외부 여백
  },
  busBox: {  // 버스 정보 박스 스타일
    borderWidth: 1, // 테두리 두께
    borderColor: '#3cb371', // 테두리 색 (녹색 계열)
    borderRadius: 6, // 테두리 둥글게
    padding: 4, // 내부 여백
    marginRight: 6 // 오른쪽 외부 여백
  },

  scrollBarContainer: { height: 8, margin: 8 }, // 커스텀 스크롤바 컨테이너: 높이 8, 외부 여백 8
  track: { ...StyleSheet.absoluteFill, backgroundColor: '#ddd' }, // 스크롤바 트랙: 절대 위치, 부모 요소 채움, 배경색 연한 회색
  thumb: {  // 스크롤바 핸들 스타일
    width: 80, // 너비
    height: 8, // 높이
    backgroundColor: '#a72020', // 배경색 (진홍색)
    position: 'absolute', // 절대 위치
    left: 0 // 왼쪽에서 0
  },
});