import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Toast from "../components/Toast";
import app from "../config/app";
import { setProfile, setUser } from "../store/actions";
import color from "../utils/color";
import { font } from "../utils/font";
import { HttpRequest, HttpResponse } from "../utils/http";
import ImageUtils from "../utils/ImageUtils";

export default function Login(props) {
    const dispatch = useDispatch();
    const [password, setPassword] = useState(__DEV__ ? app.EXAMPLE_PASSWORD : "");
    const [email, setEmail] = useState(__DEV__ ? app.EXAMPLE_EMAIL : "");
    const [isRemember, setIsRemember] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const login = useCallback(() => {
        setLoading(true);

        let data = { email, password };
        HttpRequest.login(data).then((res) => {
            console.log("Res", res.data);
            Toast.showSuccess("Login Success");
            setLoading(false);
            dispatch(setUser(res.data));

            loadProfile();
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot login"));
            setLoading(false);
        });
    }, [email, password]);

    const loadProfile = useCallback(() => {
        HttpRequest.getProfile().then((res) => {
            console.log("getProfile", res.data);
            let _profile = res.data;

            dispatch(setProfile(_profile));
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load profile data"));
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topView}>
                    <Image source={ImageUtils.logoLetter} style={styles.logo} resizeMode='contain' />
                    <Text style={styles.title}>Log in</Text>
                </View>
                <View style={styles.bottomView}>
                    <TextInput
                        // label='Email address'
                        icon={<MaterialCommunityIcons name='email-outline' size={20} color={color.gray} />}
                        placeholder="Enter your email address"
                        value={email}
                        onChangeText={setEmail}
                        containerStyle={styles.input} />

                    <TextInput
                        //label='Create password'
                        icon={<MaterialCommunityIcons name='lock-outline' size={20} color={color.gray} />}
                        secureTextEntry={true}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        containerStyle={styles.input} />


                    <TouchableOpacity style={styles.checkboxWrapper}
                        activeOpacity={1}
                        onPress={() => {
                            setIsRemember(!isRemember);
                        }}>
                        {!isRemember && <MaterialCommunityIcons name='checkbox-blank-outline' size={20} color={color.text} />}
                        {isRemember && <MaterialCommunityIcons name='check-box-outline' size={20} color={color.text} />}
                        <Text style={styles.checkboxText}>Remember Me</Text>
                    </TouchableOpacity>

                    <View style={styles.inputView}>
                        <Button
                            loading={isLoading}
                            style={{ flex: 1 }}
                            onPress={() => {
                                login();
                            }}>Log in</Button>

                        <View style={{ width: 20 }} />

                        <Button theme='secondary' style={{ flex: 1 }}
                            onPress={() => {
                                props.navigation.navigate("Intro");
                            }}>Cancel</Button>
                    </View>

                    {/* <View style={styles.or}>
                        <Text>OR</Text>
                    </View>

                    <Button style={{ marginTop: 20 }}
                        onPress={() => {
                            //props.navigation.navigate("Dashboard");
                        }}>Trial Login</Button> */}
                </View>
            </ScrollView>
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
        paddingTop: 40,
        paddingHorizontal: 40,
    },
    inputView: {
        flexDirection: 'row',
        marginTop: 30,
    },
    input: {
        marginBottom: 20,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        color: color.text,
        fontSize: 11,
        marginLeft: 5,
    },
    or: {
        marginTop: 20,
        alignItems: 'center',
    }
};