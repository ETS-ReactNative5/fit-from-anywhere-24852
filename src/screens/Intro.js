import React, { Component, useCallback, useEffect } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import color from "../utils/color";
import { font } from "../utils/font";
import ImageUtils from "../utils/ImageUtils";

export default function Intro(props) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <Image source={ImageUtils.logoLetter} style={styles.logo} resizeMode='contain' />
                <Text style={styles.title}>Sign in</Text>
            </View>
            <View style={styles.bottomView}>
                <Text style={styles.welcome}>Welcome Back</Text>

                <View style={styles.inputView}>
                    <Button style={{ flex: 1 }} onPress={() => {
                        props.navigation.navigate("Register");
                    }}>Sign up</Button>

                    <View style={{ width: 20 }} />

                    <Button style={{ flex: 1 }} onPress={() => {
                        props.navigation.navigate("Login");
                    }}>Log in</Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 30,
        fontFamily: font.sourceSansProBold,
        color: color.text,
    },
    welcome: {
        fontSize: 26,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0
    },
    topView: {
        height: 230,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    inputView: {
        flexDirection: 'row',
        marginTop: 50,
    }
};