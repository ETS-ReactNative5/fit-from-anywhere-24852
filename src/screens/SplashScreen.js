import React, { Component, useCallback, useEffect } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, StatusBar } from "react-native";
import { getUniqueId } from 'react-native-device-info';
import { setSplash } from "../store/actions";
import { useDispatch } from "react-redux";
import color from "../utils/color";
import AppConfig from '../config/app';
import Pubnub from "pubnub";
import { font } from "../utils/font";

export default function SplashScreen(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            console.log("Change to false");
            dispatch(setSplash(false));
        }, 1000);
    }, []);

    return (
        <View style={styles.container}>
            <Text>Hello</Text>
            <View style={styles.topSide}>
                <StatusBar backgroundColor='transparent' translucent={true} />
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </View>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0
    },
    topSide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 173,
        height: 227,
    }
};