import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Toast from "../components/Toast";
import color from "../utils/color";
import { font } from "../utils/font";
import { HttpRequest, HttpResponse } from "../utils/http";
import ImageUtils from "../utils/ImageUtils";

export default function ResetPassword(props) {
    const dispatch = useDispatch();
    const remember = useSelector(state => state.remember);
    const [email, setEmail] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (remember != null) {
            setEmail(remember.email);
        }
    }, [remember]);

    const resetPassword = useCallback(() => {
        setLoading(true);

        let data = { email };
        HttpRequest.resetPassword(data).then((res) => {
            console.log("Res", res.data);
            Toast.showSuccess("Reset password success");
            setLoading(false);

            props.navigation.navigate("Login");
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot login"));
            setLoading(false);
        });
    }, [email]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topView}>
                    <Image source={ImageUtils.logoLetter} style={styles.logo} resizeMode='contain' />
                    <Text style={styles.title}>Reset Password</Text>
                </View>
                <View style={styles.bottomView}>
                    <TextInput
                        // label='Email address'
                        icon={<MaterialCommunityIcons name='email-outline' size={20} color={color.gray} />}
                        placeholder="Enter your email address"
                        value={email}
                        onChangeText={setEmail}
                        containerStyle={styles.input} />

                    <View style={styles.inputView}>
                        <View style={{ flex: 1 }}>
                            <Button
                                loading={isLoading}
                                onPress={() => {
                                    resetPassword();
                                }}>Submit</Button>
                        </View>

                        <View style={{ width: 20 }} />

                        <View style={{ flex: 1 }}>
                            <Button theme='secondary'
                                onPress={() => {
                                    props.navigation.navigate("Login");
                                }}>Cancel</Button>
                        </View>
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
    },
    or: {
        marginTop: 20,
        alignItems: 'center',
    }
};