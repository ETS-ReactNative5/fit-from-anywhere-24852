import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, View, Dimensions, Text, Linking, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Combobox from "../components/Combobox";
import color from "../utils/color";
import { font } from "../utils/font";

const goals = [
    { id: 1, label: "Lose weight" },
    { id: 2, label: "Gain muscle" },
    { id: 3, label: "Maintain" },
];

export default function Onboarding(props) {
    const [page, setPage] = useState(3);
    const [goal, setGoal] = useState(1);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");
    const [weightType, setWeightType] = useState("kg");
    const [heightType, setHeightType] = useState("inch");


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

                        <Button style={{ marginTop: 30, }} onPress={() => {
                            setPage(2);
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
                            <Button theme={weightType == 'lbs' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setWeightType('lbs');
                            }}>lbs</Button>

                            <Button theme={weightType == 'kg' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setWeightType('kg');
                            }}>kg</Button>
                        </View>

                        <View style={styles.inputView}>
                            <Button style={{ flex: 1 }}
                                onPress={() => {
                                    setPage(3);
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
                            <Button theme={heightType == 'inch' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setHeightType('inch');
                            }}>inch</Button>

                            <Button theme={heightType == 'cm' ? 'primary' : 'secondary'} style={styles.chooseBtn} onPress={() => {
                                setHeightType('cm');
                            }}>cm</Button>
                        </View>

                        <View style={styles.inputView}>
                            <Button style={{ flex: 1 }}
                                onPress={() => {
                                    setPage(4);
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
                            <Button style={{ flex: 1 }}
                                onPress={() => {
                                    props.navigation.navigate("Home");
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