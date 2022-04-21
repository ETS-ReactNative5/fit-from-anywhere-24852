import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import Toast from '../components/Toast';
import _ from 'lodash';
import LoadingIndicator from '../components/LoadingIndicator';
import BottomSheet from '@gorhom/bottom-sheet';
import StyleUtils from '../utils/StyleUtils';
import Button from '../components/Button';
import useInterval from '../utils/useInterval';

import { useDispatch, useSelector } from 'react-redux';
import { setNextExercise } from '../store/actions';
import YoutubePlayer from '../components/YoutubePlayer';
import TextInput from '../components/TextInput';
import SimpleModal from '../components/SimpleModal';
import urlParser from "js-video-url-parser";

let timerResting = 0;
let timerSet = 0;

const YOUTUBE_HEIGHT = StyleUtils.getScreenWidth() * 9 / 16;

const TIMER_EXCERCISE = 'timer_excersise';
const TIMER_REST = 'timer_rest';

const TYPE_EXCERCISE = 'excercise';
const TYPE_REST = 'rest';
const TYPE_SKIP = 'skip';

const RESTING_TIME = 10;

let timerExcercise = null;
let timerRest = null;

export default function HomeWorkout(props) {
    const { plan, workout, program, workoutPlan, day, shouldSave, progress } = props.route.params;

    const dispatch = useDispatch();

    const profile = useSelector(state => state.profile);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [isLoading, setLoading] = useState(false);
    const [workoutCategories, setWorkoutCategories] = useState([]);

    const bottomSheetRef = useRef(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(0);
    const snapPoints = useMemo(() => [0, 200, '90%'], []);

    const workoutList = useMemo(() => {
        if (selectedCategory === null) {
            return [];
        }

        return workoutCategories[selectedCategory];
    }, [workoutCategories, selectedCategory]);

    const [excersizeRecords, setExcersizeRecords] = useState([]);
    const [currentSet, setCurrentSet] = useState(1);
    const [totalSet, setTotalSet] = useState(10);
    const [isResting, setIsResting] = useState(false);
    const [excerciseCount, setExcerciseCount] = useState(0);
    const [restCounter, setRestCounter] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [weight, setWeight] = useState('');
    const [weightTemp, setWeightTemp] = useState('');
    const [weightDialogVisible, setWeightDialogVisible] = useState(false);

    const [youtubeVideoId, setYoutubeVideoId] = useState('jWCm9piAwAU');

    useEffect(() => {
        stopAllTimer();

        console.log({ plan, workout, program, workoutPlan, day, progress });

        setTotalSet(workoutPlan.sets);

        if (progress) {
            setWeight(progress.weight + "");
        } else {
            if (workoutPlan.weight) {
                setWeight(workoutPlan.weight + '');
            } else {
                setWeight('');
            }
        }

        if (workout.video_url) {
            let videoData = urlParser.parse(workout.video_url);
            setYoutubeVideoId(videoData.id);
        }
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setBottomSheetIndex(index);
    }, []);

    const sheetStyle = useMemo(() => {
        if (bottomSheetIndex == 0 || bottomSheetIndex == 1) {
            return {
                height: 200,
            }
        } else {
            return { flex: 1 };
        }
    }, [bottomSheetIndex]);

    const addToList = (type, timer, set = 0) => {
        let _excRecs = [...excersizeRecords];
        _excRecs.push({
            type: type,
            time: moment().format("YYYY-MM-DD HH:mm:ss"),
            timer: timer,
            set,
        });
        setExcersizeRecords(_excRecs);
    };

    const continueExercise = useCallback(() => {
        setIsResting(false);

        stopAllTimer();

        timerSet = 0;

        //timerExcercise = setInterval(onExcersizeTimer, 1000);

        //add rest to list
        addToList(TYPE_REST, moment.utc((RESTING_TIME - timerResting) * 1000).format('mm:ss'));

        if (currentSet >= totalSet) {
            saveProgress();
        } else {
            setCurrentSet(currentSet + 1);
        }
    }, [totalSet, timerSet, timerResting, currentSet, excersizeRecords, addToList]);

    const stopAllTimer = useCallback(() => {
        //stop rest timer
        if (timerExcercise) {
            clearInterval(timerExcercise);
        }

        if (timerRest) {
            clearInterval(timerRest);
        }
    }, [timerExcercise, timerRest]);

    const onRestTimer = useCallback(() => {
        timerResting--;
        setRestCounter(timerResting);
        //console.log("Timer Counter", timerResting);

        if (timerResting <= 0) {
            console.log("Check value from", excersizeRecords);
            timerResting = 0;
            continueExercise();
        }
    }, [excersizeRecords, timerResting, continueExercise]);

    const onExcersizeTimer = () => {
        timerSet++;
        setExcerciseCount(timerSet);
        //console.log("Timer Counter", timerSet);
    }

    useInterval(() => {
        if (isResting) {
            onRestTimer();
        } else {
            onExcersizeTimer();
        }
    }, 1000);

    const nextWorkout = useCallback(() => {
        setTimeout(() => {
            dispatch(setNextExercise(true));
        }, 1000);
    }, []);

    const saveProgress = useCallback(() => {
        if (shouldSave) {
            let data = {
                set: currentSet,
                repetition: 1,
                user: profile.user.id,
                program: program.id,
                workout: workout.id,
                workout_plan: workoutPlan.id,
                weight: weight,
            };
            HttpRequest.addProgress(data).then((res) => {
                console.log("loadWorkoutPlan", res.data.results);
                Toast.showSuccess("Save progress success");

                Alert.alert(
                    'Information',
                    'Do you want to move to another excercise ?',
                    [
                        {
                            text: 'Go to Home Screen', onPress: () => {
                                props.navigation.goBack();
                            }
                        },
                        {
                            text: 'Yes', onPress: () => {
                                nextWorkout();
                                props.navigation.goBack();
                            }
                        },
                    ],
                    { cancelable: false }
                );
            }).catch((err) => {
                Toast.showError(HttpResponse.processMessage(err.response, "Cannot save progress"));
            });
        } else {
            Toast.showSuccess("Save progress success");
            props.navigation.goBack();
        }
    }, [currentSet, profile, plan, workout, program, workoutPlan, day, shouldSave, weight]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Daily Workout"
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={24} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }} />
            {isLoading && (
                <LoadingIndicator />
            )}

            {!isLoading && (
                <>
                    <ScrollView>
                        <View style={styles.item}>
                            <View style={styles.daily}>
                                <Text style={styles.dailyText}>Day {day} of {plan.days}</Text>
                            </View>

                            <YoutubePlayer
                                height={YOUTUBE_HEIGHT}
                                play={true}
                                videoId={youtubeVideoId} />

                            <View style={styles.videoContent}>
                                <Text style={styles.videoLabel}>{workout.name}</Text>
                                <Text style={styles.videoDescription}>{workout.description}</Text>
                            </View>

                            <View style={styles.section}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.sectionLabel}>Excercise rules</Text>
                                    {/* <Text style={styles.sectionTime}>11 JAN - 15 JAN</Text> */}
                                </View>
                                <View style={styles.sectionValue}>
                                    <Text style={styles.sectionQty}>Sets: {workoutPlan.sets ?? "N/A"}</Text>
                                    <View style={styles.sectionSeparator} />
                                    <Text style={styles.sectionQty}>Repetition: {workoutPlan.repetitions ?? "N/A"}</Text>
                                    <View style={styles.sectionSeparator} />
                                    <TouchableOpacity onPress={() => {
                                        setWeightDialogVisible(true);
                                        setWeightTemp(weight + '');
                                    }}>
                                        <Text style={styles.sectionQty}>Weight: {weight ?? "N/A"}</Text>
                                        <Text style={styles.sectionQtyDesc}>Click to Edit</Text>
                                    </TouchableOpacity>
                                    {/* <MaterialCommunityIcons name='yoga' size={20} color={color.text} />
                                    <Text style={styles.sectionQty}>7</Text>
                                    <View style={styles.sectionSeparator} />
                                    <MaterialCommunityIcons name='dumbbell' size={20} color={color.text} />
                                    <Text style={styles.sectionQty}>14</Text>
                                    <View style={styles.sectionSeparator} />
                                    <MaterialCommunityIcons name='weight-lifter' size={20} color={color.text} />
                                    <Text style={styles.sectionQty}>25 kg</Text> */}
                                </View>
                                <Button style={{ marginTop: 20 }} onPress={() => {
                                    stopAllTimer();

                                    bottomSheetRef.current.snapTo(1);
                                    setExcersizeRecords([]);
                                    setCurrentSet(1);

                                    timerSet = 0;

                                    //timerExcercise = setInterval(onExcersizeTimer, 1000);
                                }}>Start Excercise</Button>

                                <Button
                                    style={{ marginTop: 20 }}
                                    onPress={() => {
                                        saveProgress();
                                    }}>Shortcut</Button>
                            </View>
                        </View>

                        <View style={styles.line} />
                    </ScrollView>
                </>
            )}

            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                style={styles.bottomSheet}
            >
                <View style={[styles.bottomSheetContainer, sheetStyle]}>
                    <Text style={styles.excSetTitle}>Set {currentSet}/{totalSet}</Text>

                    <ScrollView>
                        {excersizeRecords.map((item, index) => {
                            if (item.type == TYPE_EXCERCISE) {
                                return (
                                    <View style={styles.listSet} key={index}>
                                        <View style={styles.listSetNumber}>
                                            <Text style={styles.listSetNumberText}>{item.set}</Text>
                                        </View>

                                        <View style={styles.listSetContent}>
                                            <View style={styles.badgeWrapper}>
                                                <View style={styles.badgePrimary}>
                                                    <Text style={styles.badgeText}>Excercise</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.listSetText}>{item.timer}</Text>
                                        </View>
                                    </View>
                                );
                            } else if (item.type == TYPE_REST) {
                                return (
                                    <View style={styles.listSet} key={index}>
                                        <View style={styles.listSetNumberRest}>
                                            <MaterialCommunityIcons name='timer' size={20} color={color.white} />
                                        </View>

                                        <View style={styles.listSetContent}>
                                            <View style={styles.badgeWrapper}>
                                                <View style={styles.badgeSecondary}>
                                                    <Text style={styles.badgeText}>Rest</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.listSetText}>{item.timer}</Text>
                                        </View>
                                    </View>
                                );
                            } else {
                                return (
                                    <View style={styles.listSet} key={index}>
                                        <View style={styles.listSetNumberSkipped}>
                                            <MaterialCommunityIcons name='close' size={20} color={color.white} />
                                        </View>

                                        <View style={styles.listSetContent}>
                                            <Text style={styles.listSetText}>SKIPPED</Text>
                                        </View>
                                    </View>
                                );
                            }
                        })}
                    </ScrollView>

                    {isResting && (
                        <View style={styles.excRest}>
                            {/* <CircularProgress
                                percent={40}
                                bgRingWidth={5}

                                bgColor={color.white}
                                ringColor={color.primary}
                                ringBgColor={color.gray}
                                textFontSize={20}
                                textFontColor={color.black}
                                textFontWeight='bold'
                                progressRingWidth={5}
                                radius={50}
                            /> */}

                            <Text style={styles.excTimer}>{moment.utc(timerResting * 1000).format('mm:ss')}</Text>

                            <View style={{ flexDirection: 'row', paddingTop: 30, }}>
                                <Button
                                    theme='secondary'
                                    style={{ flex: 1 }} onPress={() => {
                                        timerResting = RESTING_TIME;
                                    }}>Restart Timer</Button>

                                <View style={{ width: 10 }} />

                                <Button
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                        continueExercise();
                                    }}>Continue Excercise</Button>
                            </View>
                        </View>
                    )}

                    {!isResting && (
                        <View style={styles.excRest}>
                            <Text style={styles.excTimer}>{moment.utc(timerSet * 1000).format('mm:ss')}</Text>

                            <View style={{ flexDirection: 'row', paddingTop: 30, }}>
                                <Button
                                    theme='secondary'
                                    style={{ flex: 1 }} onPress={() => {
                                        // if (currentSet >= totalSet) {
                                        //     bottomSheetRef.current.snapTo(0);
                                        //     Toast.showSuccess("You completed the excercise");
                                        //     setCurrentSet(1);
                                        // } else {
                                        //     setCurrentSet(currentSet + 1);
                                        // }

                                        //add skip to list
                                        addToList(TYPE_SKIP, "", currentSet);

                                        setCurrentSet(currentSet + 1);
                                    }}>Skip Set</Button>

                                <View style={{ width: 10 }} />

                                <Button
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                        setIsResting(true);

                                        stopAllTimer();

                                        //add set to list
                                        addToList(TYPE_EXCERCISE, moment.utc(timerSet * 1000).format('mm:ss'), currentSet);

                                        timerResting = RESTING_TIME;

                                        //timerRest = setInterval(onRestTimer, 1000);
                                    }}>End Set & Rest</Button>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 50 }} />

                    <SimpleModal
                        visible={weightDialogVisible}
                        onRequestClose={() => {
                            setWeightDialogVisible(false);
                        }}>
                        <TextInput
                            label='Enter weight'
                            style={styles.input}
                            placeholder="Enter your eqipment weight"
                            placeholderTextColor={color.gray}
                            value={weightTemp}
                            onChangeText={(text) => {
                                setWeightTemp(text);
                            }} />

                        <Button
                            style={{ marginTop: 20 }}
                            onPress={() => {
                                setWeight(weightTemp);
                                setWeightDialogVisible(false);
                            }}>Update Weight</Button>
                    </SimpleModal>
                </View>
            </BottomSheet>
        </SafeAreaView>
    );
}

const styles = {
    daily: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    dailyText: {
        fontSize: 20,
        color: color.primary,
        fontFamily: font.sourceSansPro,
    },

    excSetTitle: {
        fontSize: 14,
        color: color.primary,
    },
    excRest: {
        paddingVertical: 20,
        // alignItems: 'center',
        justifyContent: 'center',
    },
    excTimer: {
        textAlign: 'center',
        fontSize: 20,
        color: color.primary,
        marginBottom: 20,
    },

    listSet: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    listSetNumber: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.primary,
    },
    listSetNumberRest: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.black + "88",
    },
    listSetNumberSkipped: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.danger,
    },
    listSetNumberText: {
        color: color.white,
        fontSize: 16,
    },
    listSetContent: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    listSetText: {
        fontSize: 16,
        color: color.primary
    },
    listRest: {
        paddingVertical: 10,
    },
    listRestText: {
        fontSize: 16,
        color: color.primary,
    },
    badgeWrapper: {
        flexDirection: 'row',
    },
    badgePrimary: {
        backgroundColor: color.primary,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2
    },
    badgeSecondary: {
        backgroundColor: color.black + "88",
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2
    },
    badgeText: {
        color: color.white,
        fontSize: 12,
    },



    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    categoriesWrap: {
        height: 55,
    },
    categories: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    category: {
        backgroundColor: color.white,
        borderRadius: 10,
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryActive: {
        backgroundColor: "#E5EBEE",
    },
    categoryText: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    video: {
        width: StyleUtils.getScreenWidth(),
        height: StyleUtils.getScreenWidth() * 0.6,
        backgroundColor: color.black,
    },
    videoContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    videoLabel: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
        marginBottom: 10,
    },
    videoDescription: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },



    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "rgba(229, 235, 238, 1)"
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionValue: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        justifyContent: 'center',
    },
    sectionLabel: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
        flex: 1,
    },
    sectionTime: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    sectionQty: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
        marginHorizontal: 10,
    },
    sectionQtyDesc: {
        fontSize: 12,
        fontFamily: font.sourceSansPro,
        color: color.text,
        marginHorizontal: 10,
    },
    sectionSeparator: {
        height: 30,
        width: 1,
        backgroundColor: color.text,
        marginHorizontal: 5,
    },


    bottomSheet: {
        ...StyleUtils.regularShadow,
        borderColor: color.border,
        borderWidth: 1,
        borderRadius: 10,
    },
    bottomSheetContainer: {
        // flex: 1,
        paddingHorizontal: 20,
    },
};