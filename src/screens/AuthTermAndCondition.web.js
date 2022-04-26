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

export default function AuthTermAndCondition(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Terms and Conditions"
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.navigate("Register");
                }} />
            <View style={styles.content}>
                <iframe src="https://fit-from-anywhere-24852.botics.co/static/terms.html" style={{ border: 0, width: '100%', height: '100%' }} />
            </View>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        flex: 1,
    },
};