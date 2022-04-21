import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
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
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import Combobox from '../components/Combobox';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../components/Toast';
import CacheUtils from '../utils/CacheUtils';
import ImageUtils from '../utils/ImageUtils';
import LoadingIndicator from '../components/LoadingIndicator';
import NoData from '../components/NoData';
import { useFocusEffect } from '@react-navigation/native';
import StyleUtils from '../utils/StyleUtils';

const SCREEN_WIDTH = StyleUtils.getScreenWidth();

export default function ChoosePlan(props) {
    const dispatch = useDispatch();
    const workoutPlans = useSelector(state => state.workoutPlans);
    const profile = useSelector(state => state.profile);

    const [plans, setPlans] = useState([]);
    const [userPlans, setUserPlans] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    const [combinedPlans, setCombinedPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(useCallback(() => {
        loadProgram();
        loadUserPlan();
        loadAllUserProgress();
    }, []));

    useEffect(() => {
        let _plans = [...plans];
        _plans = _plans.map((plan) => {
            plan.user_plan_id = null;

            let _userPlan = userPlans.find((userPlan) => plan.id == userPlan.plan.id);
            if (_userPlan) {
                plan.user_plan_id = _userPlan.id;
            }

            // console.log("Image", HttpUtils.normalizeUrl(plan.image));

            return plan;
        });
        setCombinedPlans(_plans);
    }, [plans, userPlans]);

    const loadAllUserProgress = useCallback(() => {
        // setIsLoading(true);
        HttpRequest.loadUserProgress(null, profile.user.id).then((res) => {
            console.log("loadUserProgress", res.data.results);
            setUserProgress(res.data.results);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot get profile"));
            // setIsLoading(false);
        });
    }, [profile]);

    const loadProgram = useCallback(() => {
        setIsLoading(true);
        HttpRequest.loadProgram(profile.fitness_goal).then((res) => {
            console.log("loadProgram", res.data);
            let plans = res.data.plans.map((plan) => {
                plan.user_plan_id = null;
                return plan;
            });
            setPlans(plans);

            loadUserPlan();
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot get profile"));
            setIsLoading(false);
        });
    }, [profile]);

    const loadUserPlan = useCallback(() => {
        setIsLoading(true);
        HttpRequest.loadUserPlan(profile.user.id).then((res) => {
            let userPlans = res.data.results;
            console.log("loadUserPlan", userPlans);
            //setUserPlans(userPlans);

            console.log("PLAN", plans);

            setUserPlans(userPlans);
            setIsLoading(false);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot get user plan"));
            setIsLoading(false);
        });
    }, [profile, plans]);

    const addUserPlan = useCallback(async (plan_id) => {
        let deletePromises = [];
        plans.forEach((plan) => {
            if (plan.user_plan_id != null) {
                deletePromises.push(HttpRequest.deleteUserPlan(plan.user_plan_id));
            }
        });

        userProgress.forEach((progress) => {
            deletePromises.push(HttpRequest.deleteProgress(progress.id));
        });

        setIsLoading(true);

        if (deletePromises.length > 0) {
            Promise.all(deletePromises).then((res) => {
                console.log("deleteUserPlan", res.data);
            }).catch((err) => {
                Toast.showError(HttpResponse.processMessage(err.response, "Cannot delete user plan"));
            });
        }

        let data = {
            plan: plan_id,
            user: profile.user.id,
        };
        HttpRequest.addUserPlan(data).then((res) => {
            Toast.showSuccess("Plan selected successfully");
            //setIsLoading(false);

            loadUserPlan();
        }).catch((err) => {
            console.log("Err", err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot add plan"));
            setIsLoading(false);
        });

    }, [userProgress, profile, plans]);

    const deleteUserPlan = useCallback((id) => {
        setIsLoading(true);
        HttpRequest.deleteUserPlan(id).then((res) => {
            Toast.showSuccess("Plan deleted successfully");
            setIsLoading(false);

            loadUserPlan();
        }).catch((err) => {
            console.log("Err", err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot add plan"));
            setIsLoading(false);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Workout Library"
                onLeftClick={() => {
                    props.navigation.openDrawer();
                }} />
            <ScrollView>
                <View style={styles.content}>
                    {isLoading && <LoadingIndicator />}

                    {!isLoading && (
                        <>
                            {combinedPlans.length == 0 && <NoData>No plan available</NoData>}
                            {combinedPlans.map((plan, index) => {
                                return (
                                    <View key={index} style={styles.card}>
                                        {plan.image == null && <Image source={ImageUtils.home1} style={styles.image} resizeMode='cover' />}
                                        {plan.image != null && <Image source={{ uri: HttpUtils.normalizeUrl(plan.image) }} style={styles.image} resizeMode='cover' />}

                                        <View style={styles.cardContent}>
                                            <View style={styles.cardContentBg}>
                                                <Text style={styles.cardContentText}>{plan.name}</Text>
                                            </View>
                                            <View style={styles.cardContentBg}>
                                                <Text style={styles.cardContentDesc}>{plan.description}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardFooter}>
                                            <View style={styles.cardFooterTextWrap}>
                                                <Text style={styles.cardFooterText}>{plan.days} days</Text>
                                                <Text style={styles.cardFooterSubtitle}>workout time</Text>
                                            </View>

                                            {plan.user_plan_id == null && (
                                                <TouchableOpacity style={styles.addButton} onPress={() => {
                                                    if (userProgress.length > 0) {
                                                        Alert.alert(
                                                            'Warning',
                                                            'Selecting this plan means you will delete all progress you\'ve made. Are you sure ?',
                                                            [
                                                                { text: 'No', onPress: () => { }, style: 'cancel' },
                                                                {
                                                                    text: 'Yes', onPress: () => {
                                                                        addUserPlan(plan.id);
                                                                    }
                                                                },
                                                            ],
                                                            { cancelable: false }
                                                        );
                                                    } else {
                                                        addUserPlan(plan.id);
                                                    }
                                                }}>
                                                    <Text style={styles.addButtonText}>Select</Text>
                                                </TouchableOpacity>
                                            )}

                                            {plan.user_plan_id != null && (
                                                <View style={styles.deleteButton}>
                                                    <Text style={styles.deleteButtonText}>Selected</Text>
                                                </View>
                                            )}

                                            {/* {plan.user_plan_id != null && (
                                                <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                                    deleteUserPlan(plan.user_plan_id);
                                                }}>
                                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                                </TouchableOpacity>
                                            )} */}
                                        </View>
                                    </View>
                                );
                            })}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    content: {
        padding: 20,
    },
    card: {
        // backgroundColor: color.primary,
        width: SCREEN_WIDTH - 40,
        height: 3 / 5 * (SCREEN_WIDTH - 40),
        marginBottom: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    cardContent: {
        flex: 1,
        padding: 20,
    },
    cardContentBg: {
        flexDirection: 'row',
    },
    cardContentText: {
        color: color.primary,
        fontSize: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: 5,
    },
    cardContentDesc: {
        color: color.primary,
        fontSize: 13,
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: 5,
        marginTop: 5,
    },
    cardFooter: {
        height: 60,
        backgroundColor: 'rgba(0, 51, 88, 0.8)',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    cardFooterTextWrap: {
        flex: 1,

    },
    cardFooterText: {
        color: color.white,
        fontSize: 20,
    },
    cardFooterSubtitle: {
        color: color.white,
        fontSize: 10,
        // marginLeft: 30,
    },

    addButton: {
        backgroundColor: color.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    addButtonText: {
        color: color.primary,
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: color.success,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    deleteButtonText: {
        color: color.white,
        fontSize: 14,
    },
};