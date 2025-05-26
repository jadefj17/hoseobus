// SplashScreen.tsx
import React, { useEffect } from 'react';
import { StyleSheet, Image, SafeAreaView } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.dispatch(StackActions.replace('Home'));
        }, 3000); // 3초 후 Home으로 이동

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/hoseobus.png')} style={styles.logo} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AE2D2C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
    },
});

export default SplashScreen;
