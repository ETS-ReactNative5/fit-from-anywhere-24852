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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import WebView from 'react-native-webview';

export default function AuthPrivacyPolicy(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Privacy Policy"
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.navigate("Register");
                }} />
            <WebView
                originWhitelist={['*']}
                source={{ uri: "https://fit-from-anywhere-24852.botics.co/static/privacy-policy.html" }}
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