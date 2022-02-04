import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home(props) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>This is home</Text>
        </SafeAreaView>
    );
}

const styles = {
    button: {
        backgroundColor: '#00FF00',
        padding: 10,
        marginTop: 10,
    }
};