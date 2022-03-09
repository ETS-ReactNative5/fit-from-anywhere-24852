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

export default function PrivacyPolicy(props) {
    const [source, setSource] = useState('test');

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Privacy Policy" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <View style={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: source }} />
                </View>
            </ScrollView>
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
    },
};