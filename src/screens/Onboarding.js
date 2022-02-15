import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import Combobox from "../components/Combobox";
import Toast from "../components/Toast";
import color from "../utils/color";
import { font } from "../utils/font";
import { HttpRequest, HttpResponse } from "../utils/http";

const goals = [
    { id: "lose_weight", label: "Lose weight" },
    { id: "build_muscle", label: "Build muscle" },
    { id: "maintain", label: "Maintain" },
];

export default function Onboarding(props) {
    const user = useSelector(state => state.user);

    const [page, setPage] = useState(1);
    const [goal, setGoal] = useState(user.profile.fitness_goal ?? "lose_weight");
    const [weight, setWeight] = useState(user.profile.weight ?? "0");
    const [height, setHeight] = useState(user.profile.height ?? "0");
    const [age, setAge] = useState(user.profile.age ?? "0");
    const [weightType, setWeightType] = useState(user.profile.weight_metric ?? "LB");
    const [heightType, setHeightType] = useState(user.profile.height_metric ?? "CM");
    const [isLoading, setLoading] = useState(false);

    const patchProfile = useCallback((data) => {
        setLoading(true);
        HttpRequest.patchUserProfile(data).then((res) => {
            Toast.showSuccess("Update profile success");

            if (page == 4) {
                props.navigation.navigate("Home");
            } else {
                setPage(page + 1);
            }
            setLoading(false);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot update profile"));
            setLoading(false);
        });
    }, [page]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.progressView}>
                    <View style={[styles.progressBar, { width: (page / 3 * 100) + "%" }]} />
                </View>

                {page == 1 && (
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
                            patchProfile({ fitness_goal: goal });
                        }}>Next</Button>
                    </>
                )}

                {page == 2 && (
                    <>
                        <Text style={styles.question}>What is your weight?</Text>

                        <TextInput
                            placeholder="90"
                            keyboardType="numeric"
                            maxLength={3}
                            value={weight}
                            onChangeText={setWeight}
                            style={styles.bigNumber} />

                        <View style={styles.weightTypeView}>
                            <Button theme={weightType == 'LB' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setWeightType('LB');
                            }}>lbs</Button>

                            <Button theme={weightType == 'KG' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setWeightType('KG');
                            }}>kg</Button>
                        </View>

                        <View style={styles.inputView}>
                            <Button loading={isLoading} style={{ flex: 1 }}
                                onPress={() => {
                                    patchProfile({
                                        weight: weight,
                                        weight_metric: weightType
                                    });
                                }}>NEXT</Button>

                            <View style={{ width: 20 }} />

                            <Button theme='secondary' style={{ flex: 1 }}
                                onPress={() => {
                                    props.navigation.navigate("Home");
                                }}>SKIP</Button>
                        </View>
                    </>
                )}

                {page == 3 && (
                    <>
                        <Text style={styles.question}>What is your height?</Text>

                        <TextInput
                            placeholder="90"
                            keyboardType="numeric"
                            maxLength={3}
                            value={height}
                            onChangeText={setHeight}
                            style={styles.bigNumber} />

                        <View style={styles.weightTypeView}>
                            <Button theme={heightType == 'IN' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setHeightType('IN');
                            }}>inch</Button>

                            <Button theme={heightType == 'CM' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setHeightType('CM');
                            }}>cm</Button>
                        </View>

                        <View style={styles.inputView}>
                            <Button loading={isLoading} style={{ flex: 1 }}
                                onPress={() => {
                                    patchProfile({
                                        height: height,
                                        height_metric: heightType
                                    })
                                }}>NEXT</Button>

                            <View style={{ width: 20 }} />

                            <Button theme='secondary' style={{ flex: 1 }}
                                onPress={() => {
                                    props.navigation.navigate("Home");
                                }}>SKIP</Button>
                        </View>
                    </>
                )}

                {page == 4 && (
                    <>
                        <Text style={styles.question}>What is your age?</Text>

                        <TextInput
                            placeholder="90"
                            keyboardType="numeric"
                            maxLength={3}
                            value={age}
                            onChangeText={setAge}
                            style={styles.bigNumber} />

                        <View style={styles.inputView}>
                            <Button loading={isLoading} style={{ flex: 1 }}
                                onPress={() => {
                                    patchProfile({
                                        age: age
                                    })
                                }}>NEXT</Button>

                            <View style={{ width: 20 }} />

                            <Button theme='secondary' style={{ flex: 1 }}
                                onPress={() => {
                                    props.navigation.navigate("Home");
                                }}>SKIP</Button>
                        </View>
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
        backgroundColor: color.primary,
        paddingTop: 100,
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