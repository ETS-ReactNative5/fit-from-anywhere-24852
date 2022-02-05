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

export default function Message(props) {


    return (
        <SafeAreaView style={styles.container}>
            <Header title="Direct Messages" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <View style={styles.profile}>
                    <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
                </View>

                <View style={styles.line} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    button: {
        backgroundColor: '#00FF00',
        padding: 10,
        marginTop: 10,
    },
    line: {
        height: 1,
        backgroundColor: color.gray,
    },
    profile: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    profileImage: {
        width: 63,
        height: 63,
        borderRadius: 10,
    },
};