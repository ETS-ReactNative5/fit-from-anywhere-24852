import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';

export default function PrivacyPolicy(props) {


    return (
        <SafeAreaView style={styles.container}>
            <Header title="Privacy Policy" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <WebView
                originWhitelist={['*']}
                source={{ uri: "https://www.crowdbotics.com/privacy-policy" }}
            />
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
};