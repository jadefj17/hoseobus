import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen';  // 경로는 네가 만든 폴더/파일에 맞게 수정
import HomeScreen from './HomeScreen';
import StationScreen from './StationScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Station" component={StationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
