import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import Combobox from "../components/Combobox";
import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";
import Toast from "../components/Toast";
import { setProfile } from "../store/actions";
import color from "../utils/color";
import { font } from "../utils/font";
import GymUtils from "../utils/GymUtils";
import { HttpRequest, HttpResponse } from "../utils/http";

export default function ChooseProgram(props) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const profile = useSelector(state => state.profile);
    const programs = useSelector(state => state.programs);

    const [page, setPage] = useState(1);
    const [goals, setGoals] = useState([]);
    const [goal, setGoal] = useState(user.profile?.fitness_goal ?? "");
    const [weight, setWeight] = useState(user.profile?.weight ?? "0");
    const [height, setHeight] = useState(user.profile?.height ?? "0");
    const [age, setAge] = useState(user.profile?.age ?? "0");
    const [weightType, setWeightType] = useState(user.profile?.weight_metric ?? "LB");
    const [heightType, setHeightType] = useState(user.profile?.height_metric ?? "CM");
    const [isLoading, setLoading] = useState(false);
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        loadProfile();
        //loadPlan();
    }, []);

    useEffect(() => {
        if (programs.length > 0) {
            setGoals(programs.map(p => {
                return {
                    id: p.id,
                    label: p.name,
                };
            }));
            setReady(true);
        } else {
            setReady(false);
        }
    }, [programs]);

    const loadProfile = useCallback(() => {
        HttpRequest.getProfile().then((res) => {
            console.log("getProfile", res.data);
            let _profile = res.data;
            dispatch(setProfile(_profile));
            setGoal(_profile.fitness_goal ?? "");

            GymUtils.getProgramByGymCode(_profile.trial_code ?? "", dispatch);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot get profile"));
        });
    }, []);

    const patchProfile = useCallback((data) => {
        setLoading(true);
        HttpRequest.patchUserProfile(data).then((res) => {
            Toast.showSuccess("Update profile success");

            setLoading(false);

            loadProfile();

            setTimeout(() => {
                props.navigation.goBack();
            }, 1000);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot update profile"));
            setLoading(false);
        });
    }, [page]);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Fitness Goal"
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }} />
            <View style={styles.content}>
                {!isReady && (
                    <LoadingIndicator />
                )}

                {isReady && (
                    <>
                        <Text style={styles.question}>What is your fitness goal?</Text>

                        <Combobox
                            // label="Select your specialization"
                            selectedValue={goal}
                            data={goals}
                            onValueChange={(val, itemIndex) => {
                                setGoal(val);
                            }}
                        />

                        <Button loading={isLoading} style={{ marginTop: 30, }} onPress={() => {
                            patchProfile({ fitness_goal: goal, is_trainer: false });
                        }}>Update</Button>

                    </>
                )}
            </View>
            <View style={styles.bottomWhite} />
        </SafeAreaView>
    );
}

const styles = {
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: color.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 40,
    },
    bottomWhite: {
        backgroundColor: color.white,
        position: 'absolute',
        bottom: 0,
        height: 110,
        width: '100%',
    },
    progressView: {
        flexDirection: 'row',
        backgroundColor: color.gray,
        height: 3,

        marginBottom: 20,
    },
    progressBar: {
        backgroundColor: color.primary,
        height: 3,
    },
    question: {
        fontSize: 25,
        fontFamily: font.sourceSansPro,
    },
    bigNumber: {
        fontSize: 45,
        color: color.primary,
        fontFamily: font.sourceSansPro,
        // backgroundColor: 'red',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 15,
    },
    weightTypeView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    chooseBtn: {
        marginHorizontal: 5,
        paddingHorizontal: 15,
    },
    inputView: {
        flexDirection: 'row',
        marginTop: 30,
    }
};