import React, { Component, useCallback, useEffect } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro(props) {

    return (
        <SafeAreaView style={styles.container}>
            <Text>Intro</Text>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        flex: 1,
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
    }
};