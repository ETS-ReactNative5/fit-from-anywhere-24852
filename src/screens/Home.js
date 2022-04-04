import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import Button from '../components/Button';
import { LineChart } from 'react-native-chart-kit';
import { setShowOnboard } from '../store/actions';
import ImageUtils from '../utils/ImageUtils';
import Toast from '../components/Toast';
import CacheUtils from '../utils/CacheUtils';
import { useFocusEffect } from '@react-navigation/native';
import ProgressBar from '../components/ProgressBar';
import NoData from '../components/NoData';

const rawData = [50, 10, 40, 95, 85, 91];

const promotions = [
    {
        label: "Freedom Yoga",
        description: "Village resort - Virtual",
        image: ImageUtils.home1,
    },
    {
        label: "Gym Workout",
        description: "New gym resort - Live",
        image: ImageUtils.home2,
    },
    {
        label: "Freedom Yoga",
        description: "Village resort - Virtual",
        image: ImageUtils.home1,
    },
    {
        label: "Gym Workout",
        description: "New gym resort - Live",
        image: ImageUtils.home2,
    },
];

export default function Home(props) {
    const dispatch = useDispatch();
    const workoutPlans = useSelector(state => state.workoutPlans);
    const profile = useSelector(state => state.profile);
    // console.log("Profile", profile);
    const isOnboarding = useSelector(state => state.isOnboarding);
    const [focusedDate, setFocusedDate] = useState(moment());
    const scrollRef = useRef();
    const calendarRef = useRef();
    const [plans, setPlans] = useState([]);
    const [program, setProgram] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [dailyWorkoutPlans, setDailyWorkoutPlans] = useState([]);
    const [userPlanCreatedTime, setUserPlanCreatedTime] = useState(null);
    const [dayNumber, setDayNumber] = useState(0);

    const profileImage = useMemo(() => {
        return profile?.profile_image ? { uri: HttpUtils.normalizeUrl(profile.profile_image) } : ImageUtils.profileImage;
    }, [profile]);

    const months = useMemo(() => {
        let months = [];
        for (let i = 0; i < 12; i++) {
            let monthMoment = moment().add(i, 'month');
            months.push({
                monthMoment,
                isFocused: monthMoment.isSame(focusedDate, 'month'),
            });
        }
        return months;
    }, [focusedDate]);

    useEffect(() => {
        console.log("Is onboarding", isOnboarding);
        if (isOnboarding && (profile.is_trainer == false || profile.is_trainer == null)) {
            props.navigation.navigate("Onboarding");
            dispatch(setShowOnboard(false));
        }
    }, [isOnboarding, profile]);

    useEffect(() => {
        console.log("Workoutplans", workoutPlans);
    }, [workoutPlans]);

    useFocusEffect(useCallback(() => {
        loadProgram();
        loadUserPlan();
    }, []));

    useEffect(() => {
        console.log("Something changed..");
        let startTime = userPlanCreatedTime ? moment(userPlanCreatedTime).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
        let _dayNumber = moment.duration(moment(selectedDate).diff(startTime)).asDays() + 1;
        setDayNumber(_dayNumber);

        //getworkout plan by day number
        if (selectedPlan != null && userPlanCreatedTime != null) {
            loadWorkoutPlan(selectedPlan.id, _dayNumber);
        }
    }, [selectedPlan, userPlanCreatedTime, selectedDate]);

    const loadProgram = useCallback(() => {
        if (profile.fitness_goal != "" && profile.fitness_goal != null) {
            HttpRequest.loadProgram(profile.fitness_goal).then((res) => {
                console.log("loadProgram", res.data);
                setProgram(res.data);
                // let plans = res.data.plans;
                // plans.forEach((plan) => {
                //     CacheUtils.findWorkoutPlansByPlanId(plan.id, dispatch);
                // });
                // setPlans(res.data.plans);
            }).catch((err) => {
                Toast.showError(HttpResponse.processMessage(err.response, "Cannot get profile"));
            });
        }
    }, [profile]);

    const loadUserPlan = useCallback(() => {
        console.log("LoadUserPlan");
        HttpRequest.loadUserPlan(profile.user.id).then((res) => {
            let userPlans = res.data.results;
            console.log("loadUserPlan", userPlans);

            if (userPlans.length > 0) {
                // setUserPlanCreatedTime("2022-03-30");// 
                setUserPlanCreatedTime(userPlans[userPlans.length - 1].created_at);
                setSelectedPlan(userPlans[userPlans.length - 1].plan);
            } else {
                setUserPlanCreatedTime(null);
                setSelectedPlan(null);
            }

            let plans = userPlans.map((userPlan) => {
                return userPlan.plan;
            });

            plans.forEach((plan) => {
                CacheUtils.findWorkoutPlansByPlanId(plan.id, dispatch);
            });

            setPlans(plans);
            setIsLoading(false);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot get user plan"));
            setIsLoading(false);
        });
    }, [profile]);

    const loadWorkoutPlan = useCallback((plan_id, day) => {
        setIsLoading(true);
        HttpRequest.loadWorkoutPlan(plan_id, day).then((res) => {
            console.log("loadWorkoutPlan", res.data.results);
            setDailyWorkoutPlans(res.data.results);
            setIsLoading(false);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot get workout plan"));
            setIsLoading(false);
        });
    }, []);

    const [trialDay, setTrialDay] = useState(10); //10 means no trial

    useEffect(() => {
        let day = 10;
        if (profile.trial_code == null || profile.trial_code == "") {
            day = 7 - moment().diff(moment(profile.created_at), 'days');
        }
        setTrialDay(day);
    }, [profile]);


    return (
        <SafeAreaView style={styles.container}>
            <Header title="Dashboard" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <View style={styles.profile}>
                    <Image source={profileImage} style={styles.profileImage} />
                    <View style={styles.profileContent}>
                        <Text style={styles.profileName}>{profile?.user?.name}</Text>
                        <View style={styles.profileInfo}>
                            {trialDay != 10 && (
                                <>
                                    {trialDay >= 0 && (
                                        <View style={styles.trialBadge}>
                                            <Text style={styles.trialBadgeText}>Trial for {trialDay} day{trialDay != 1 && "s"}</Text>
                                        </View>
                                    )}
                                    {trialDay < 0 && (
                                        <View style={styles.trialBadge}>
                                            <Text style={styles.trialBadgeText}>Trial Expired</Text>
                                        </View>
                                    )}
                                </>
                            )}

                            {trialDay == 10 && (
                                <View style={styles.trialBadgeOk}>
                                    <Text style={styles.trialBadgeText}>Gym Code: {profile.trial_code}</Text>
                                </View>
                            )}
                            {/* <MaterialCommunityIcons name="map-marker" size={15} color={color.text} />
                            <Text style={styles.profileLocation}>{profile?.student_campus_residential_address}</Text> */}
                        </View>
                    </View>
                </View>

                <View style={styles.line} />

                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <Button style={{ flex: 1, height: 40 }} onPress={() => { props.navigation.navigate("Appointment") }}>Make Appointment</Button>
                    <View style={{ width: 20 }} />
                    <Button style={{ flex: 1, height: 40 }} onPress={() => { props.navigation.navigate("Message") }}>Message Trainer</Button>

                </View>

                {/* <Button style={{ height: 40 }} onPress={() => { props.navigation.goBack() }}>Back</Button> */}

                <View style={styles.line} />

                <View style={styles.calendar}>
                    <View style={styles.calendarHeader}>
                        <ScrollView ref={scrollRef} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ width: 20 }} />
                            {months.map((month, index) => {
                                let focusedMonth = month.monthMoment.isSame(focusedDate, 'month');
                                return (
                                    <TouchableOpacity key={index} style={styles.monthButton} onPress={() => {
                                        // let date = month.monthMoment.format("YYYY-MM-DD");
                                        //scrollRef.current.scrollTo({ x: 100 * index + 20, animated: true });
                                        calendarRef.current.setSelectedDate(month.monthMoment);
                                    }}>
                                        <Text style={[styles.monthButtonText, focusedMonth ? { color: color.primary } : {}]}>{month.monthMoment.format("MMMM")}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    <CalendarStrip
                        ref={calendarRef}
                        scrollable
                        // style={{ height: 100 }}
                        upperCaseDays={false}
                        showMonth={false}
                        calendarColor={color.white}
                        calendarHeaderStyle={{ color: color.primary }}
                        // dayContainerStyle={{ backgroundColor: 'blue', overflow: 'visible' }}
                        // dateContainerStyle={{ backgroundColor: 'blue',  }}
                        dateNumberStyle={{ color: color.primary, marginTop: 5, fontSize: 16 }}
                        highlightDateNumberStyle={{ color: color.primary, marginTop: 5, fontSize: 16 }}
                        dateNameStyle={{ color: color.primary, fontSize: 12 }}
                        highlightDateNameStyle={{ color: color.primary, fontSize: 12 }}
                        // iconContainer={{ flex: 0.1 }}
                        onDateSelected={(date) => {
                            setSelectedDate(date.format("YYYY-MM-DD"));
                        }}
                        onWeekChanged={(start, end) => {
                            //console.log(start, end);
                            // setSelectedDate(moment(start).format("YYYY-MM-DD"));
                            setFocusedDate(start);
                            //get month difference with today
                            let firstDate = moment().date(1)
                            let difference = start.diff(firstDate, 'month');
                            console.log("Difference: ", difference);
                            scrollRef.current.scrollTo({ x: 100 * difference, animated: true });
                        }}
                        customDatesStyles={[
                            {
                                startDate: moment(selectedDate), // Single date since no endDate provided
                                // dateNameStyle: styles.dateNameStyle,
                                // dateNumberStyle: styles.dateNumberStyle,
                                // // Random color...
                                dateContainerStyle: {
                                    // backgroundColor: 'red',
                                    borderWidth: 1,
                                    borderColor: color.primary,
                                },
                            }
                        ]}
                    />
                </View>

                <View style={styles.line} />

                <View style={styles.progressBar}>
                    <Text style={styles.progressBarTitle}>Your progress: {progressPercentage}%</Text>
                    <ProgressBar percentage={progressPercentage} />
                </View>

                <Text style={styles.chartTitle}>{moment(selectedDate).format("MMM DD, YYYY")} - Day #{dayNumber}</Text>

                {selectedPlan != null && (
                    <View style={styles.plan}>
                        <Text style={styles.chartSubtitle}>{selectedPlan.name}</Text>

                        {dailyWorkoutPlans.length == 0 && <NoData>No workout today</NoData>}

                        {dailyWorkoutPlans.map((dailyWorkoutPlan, index) => {
                            return (
                                <TouchableOpacity key={index} style={styles.workout} onPress={() => {
                                    props.navigation.navigate("HomeWorkout", {
                                        workout: dailyWorkoutPlan.workout,
                                        plan: selectedPlan,
                                        program: program,
                                        workoutPlan: dailyWorkoutPlan,
                                        day: dayNumber,
                                    });
                                }}>
                                    <Image source={ImageUtils.home1} style={styles.workoutImage} />
                                    <View style={styles.workoutContent}>
                                        <Text style={styles.workoutTitle}>{dailyWorkoutPlan.workout?.name}</Text>
                                        <Text style={styles.workoutDesc}>{dailyWorkoutPlan.workout?.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {selectedPlan == null && (
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <NoData>No selected plan</NoData>

                        <Button onPress={() => {
                            props.navigation.navigate("ChoosePlan");
                        }}>Click here to select plan</Button>
                    </View>
                )}

                {/* <Text style={styles.chartTitle}>Frequency Bar chart</Text>
                <Text style={styles.chartSubtitle}>Days of workout</Text>

                <LineChart
                    data={{
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [
                            {
                                data: rawData
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: color.white,
                        backgroundGradientTo: color.white,
                        fillShadowGradientFrom: color.primary,
                        fillShadowGradientFromOpacity: 0.9,
                        fillShadowGradientTo: color.primary,
                        fillShadowGradientToOpacity: 0,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => color.primary,//`rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: color.primary,
                        }
                    }}
                    withDots={false}
                    withVerticalLines={false}
                    withOuterLines={false}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />

                <Text style={styles.chartTitle}>Activity Bar chart</Text>
                <Text style={styles.chartSubtitle}>Days of workout</Text>

                <LineChart
                    data={{
                        labels: ["Jump", "Sit Ups", "Push Ups", "Bench Press", "Rope", "Barbell"],
                        datasets: [
                            {
                                data: rawData
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: color.white,
                        backgroundGradientTo: color.white,
                        fillShadowGradientFrom: color.primary,
                        fillShadowGradientFromOpacity: 0.9,
                        fillShadowGradientTo: color.primary,
                        fillShadowGradientToOpacity: 0,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => color.primary,//`rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: color.primary,
                        },
                        propsForVerticalLabels: {
                            fontSize: "8"
                        },
                    }}
                    withDots={false}
                    withVerticalLines={false}
                    withOuterLines={false}
                    // verticalLabelRotation={30}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                /> */}

                <View style={styles.line} />

                <View style={styles.promo}>
                    <Text style={styles.promoTitle}>Promo</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ width: 20 }} />
                        {promotions.map((item, index) => {
                            return (
                                <View style={styles.promoItem} key={index}>
                                    <Image source={item.image} style={styles.promoImage} />
                                    <Text style={styles.promoLabel}>{item.label}</Text>
                                    <Text style={styles.promoDescription}>{item.description}</Text>
                                </View>
                            );
                        })}
                        <View style={{ width: 10 }} />
                    </ScrollView>
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
    trialBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: color.danger,
        borderRadius: 5,
    },
    trialBadgeOk: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: color.success,
        borderRadius: 5,
    },
    trialBadgeText: {
        color: color.white,
        fontSize: 12,
    },

    button: {
        backgroundColor: '#00FF00',
        padding: 10,
        marginTop: 10,
    },
    line: {
        height: 1,
        backgroundColor: color.gray,
    },
    progressBar: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    profile: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    profileImage: {
        width: 63,
        height: 63,
        borderRadius: 10,
    },
    profileContent: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15,
    },
    profileName: {
        fontSize: 20,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileLocation: {
        fontSize: 12,
        fontFamily: font.sourceSansPro,
        color: color.text,
        marginLeft: 5,
    },
    itemContent: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    calendar: {
        // paddingHorizontal: 20,
        paddingVertical: 20,
    },
    calendarHeader: {
        height: 30,
        // backgroundColor: 'blue',
    },
    monthButton: {
        width: 100,
    },
    monthButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.gray,
    },


    chartTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: color.primary,
        // marginTop: 20,
        marginLeft: 20,
    },
    chartSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: color.primary,
        marginTop: 5,
        marginLeft: 20,
        marginBottom: 15,
    },

    promo: {
        paddingVertical: 20,
    },
    promoTitle: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
        marginLeft: 20,
        marginBottom: 10,
    },
    promoItem: {
        width: 150,
        marginRight: 10,
    },
    promoImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    promoLabel: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
    },
    promoDescription: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },

    workout: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    workoutImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    workoutTitle: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
    },
    workoutDesc: {
        fontSize: 13,
        fontFamily: font.sourceSansPro,
        color: color.primary,
    },
    workoutContent: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: 'rgba(229, 235, 238, 1)',
        paddingHorizontal: 10,
        borderRadius: 10,
        paddingVertical: 5,
    },
};