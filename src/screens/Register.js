import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Toast from "../components/Toast";
import app from "../config/app";
import color from "../utils/color";
import { font } from "../utils/font";
import { HttpRequest, HttpResponse } from "../utils/http";
import ImageUtils from "../utils/ImageUtils";

export default function Register(props) {
    const [name, setName] = useState(__DEV__ ? app.EXAMPLE_FULL_NAME : "");
    const [phoneNumber, setPhoneNumber] = useState(__DEV__ ? app.EXAMPLE_PHONE : "");
    const [email, setEmail] = useState(__DEV__ ? app.EXAMPLE_EMAIL : "");
    const [gymCode, setGymCode] = useState("");
    const [password, setPassword] = useState(__DEV__ ? app.EXAMPLE_PASSWORD : "");
    const [passwordConfirm, setPasswordConfirm] = useState(__DEV__ ? app.EXAMPLE_PASSWORD : "");
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const register = useCallback(() => {
        //validate password
        if (password !== passwordConfirm) {
            Toast.showError("Password does not match");
            return;
        }
        if (password.length < 6) {
            Toast.showError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        let data = {
            name,
            email,
            password,
        };
        HttpRequest.signup(data).then((res) => {
            console.log("Res", res.data);
            Toast.showSuccess("Register Success, Please Login");
            setIsLoading(false);
            props.navigation.navigate("Login");
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot login"));
            setIsLoading(false);
        });
    }, [name, email, password, passwordConfirm]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <Image source={ImageUtils.logoLetter} style={styles.logo} resizeMode='contain' />
                <Text style={styles.title}>Sign up</Text>
            </View>
            <ScrollView>
                <View style={styles.bottomView}>
                    <TextInput
                        // label='Email address'
                        icon={<MaterialCommunityIcons name='account' size={20} color={color.gray} />}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        containerStyle={styles.input} />

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
                        placeholder="Create password"
                        value={password}
                        onChangeText={setPassword}
                        containerStyle={styles.input} />

                    <TextInput
                        //label='Create password'
                        icon={<MaterialCommunityIcons name='lock-outline' size={20} color={color.gray} />}
                        secureTextEntry={true}
                        placeholder="Confirm password"
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        containerStyle={styles.input} />

                    <TextInput
                        // label='Email address'
                        icon={<MaterialCommunityIcons name='numeric' size={20} color={color.gray} />}
                        placeholder="Enter your gym code"
                        value={gymCode}
                        onChangeText={setGymCode}
                        containerStyle={styles.input} />

                    <TouchableOpacity style={styles.checkboxWrapper}
                        activeOpacity={1}
                        onPress={() => {
                            setIsChecked(!isChecked);
                        }}>
                        {!isChecked && <MaterialCommunityIcons name='radiobox-blank' size={20} color={color.text} />}
                        {isChecked && <MaterialCommunityIcons name='radiobox-marked' size={20} color={color.text} />}
                        <Text style={styles.checkboxText}>I have read Terms and Conditions and Privacy Policy</Text>
                    </TouchableOpacity>

                    <View style={styles.inputView}>
                        <Button
                            loading={isLoading}
                            style={{ flex: 1, backgroundColor: isChecked ? color.primary : 'rgba(0, 51, 88, 0.4)' }}
                            onPress={() => {
                                if (isChecked) {
                                    register();
                                }
                            }}>Sign up</Button>

                        <View style={{ width: 20 }} />

                        <Button theme='secondary' style={{ flex: 1 }}
                            onPress={() => {
                                props.navigation.navigate("Intro");
                            }}>Cancel</Button>
                    </View>
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
    }
};