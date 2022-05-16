import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    Switch,
    Platform
} from "react-native";
import color from "../utils/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setProfile, setUser } from "../store/actions";
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { font } from "../utils/font";
import { HttpUtils } from "../utils/http";
import ImageUtils from "../utils/ImageUtils";
import moment from "moment";
import { useDrawerStatus } from "@react-navigation/drawer";
import PushNotificationUtils from "../utils/PushNotificationUtils";
import { usePubNub } from "pubnub-react";
import SimpleModal from "../components/SimpleModal";
import Button from "../components/Button";

const userMenus = [
    {
        icon: <MaterialCommunityIcons name="home" size={30} color={color.text} />,
        label: "Home",
        target: "Home",
    },
    {
        icon: <MaterialCommunityIcons name="message-text-outline" size={30} color={color.text} />,
        label: "Message",
        target: "Message",
        type: 'message',
    },
    {
        icon: <MaterialCommunityIcons name="bell" size={30} color={color.text} />,
        label: "Notifications",
        target: "Notification",
        type: 'notification',
    },
    {
        icon: <MaterialCommunityIcons name="dumbbell" size={30} color={color.text} />,
        label: "Workout Library",
        target: "ChoosePlan",
    },
    {
        icon: <MaterialCommunityIcons name="book-multiple" size={30} color={color.text} />,
        label: "Resources Library",
        target: "Resource",
    },
    {
        icon: <MaterialCommunityIcons name="calendar-clock" size={30} color={color.text} />,
        label: "Appointments",
        target: "Appointment",
    },
    {
        icon: <MaterialCommunityIcons name="shield-lock" size={30} color={color.text} />,
        label: "Privacy policy",
        target: "PrivacyPolicy",
    },
    {
        icon: <MaterialCommunityIcons name="file-document-edit-outline" size={30} color={color.text} />,
        label: "Terms and conditions",
        target: "TermAndCondition",
    },
    {
        icon: <MaterialCommunityIcons name="bell-circle-outline" size={30} color={color.text} />,
        label: "Push notifications",
        target: null,
        type: "push",
    },
    // {
    //     icon: <MaterialCommunityIcons name="email-alert" size={30} color={color.text} />,
    //     label: "Email notifications",
    //     target: null,
    //     // type: "email",
    // },
];

const trainerMenus = [
    {
        icon: <MaterialCommunityIcons name="home" size={30} color={color.text} />,
        label: "Home",
        target: "Home",
    },
    {
        icon: <MaterialCommunityIcons name="message-text-outline" size={30} color={color.text} />,
        label: "Message",
        target: "Message",
        type: 'message',
    },
    {
        icon: <MaterialCommunityIcons name="bell" size={30} color={color.text} />,
        label: "Notifications",
        target: "Notification",
        type: 'notification',
    },
    {
        icon: <MaterialCommunityIcons name="calendar-clock" size={30} color={color.text} />,
        label: "Appointments",
        target: "Appointment",
    },
    {
        icon: <MaterialCommunityIcons name="shield-lock" size={30} color={color.text} />,
        label: "Privacy policy",
        target: "PrivacyPolicy",
    },
    {
        icon: <MaterialCommunityIcons name="file-document-edit-outline" size={30} color={color.text} />,
        label: "Terms and conditions",
        target: "TermAndCondition",
    },
    {
        icon: <MaterialCommunityIcons name="bell-circle-outline" size={30} color={color.text} />,
        label: "Push notifications",
        target: null,
        type: "push",
    },
    // {
    //     icon: <MaterialCommunityIcons name="email-alert" size={30} color={color.text} />,
    //     label: "Email notifications",
    //     target: null,
    //     type: "email"
    // },
];

export default function Sidebar(props) {
    const dispatch = useDispatch();
    const pubnub = usePubNub();
    const profile = useSelector(state => state.profile);
    const gym = useSelector(state => state.gym);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [hasMessage, setHasMessage] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);

    const [isShowLogout, setIsShowLogout] = useState(false);

    const drawerStatus = useDrawerStatus();

    const [trialDay, setTrialDay] = useState(10); //10 means no trial

    useEffect(() => {
        let day = 10;
        if (profile.trial_code == null || profile.trial_code == "") {
            day = 7 - moment().diff(moment(profile.created_at), 'days');
        }
        setTrialDay(day);
    }, [profile]);

    //console.log("Profile", profile);

    const menus = useMemo(() => {
        return profile.is_trainer ? trainerMenus : userMenus;
    }, [profile]);

    const profileImage = useMemo(() => {
        return profile?.profile_image ? { uri: HttpUtils.normalizeUrl(profile.profile_image) } : ImageUtils.profileImage;
    }, [profile]);

    const logout = useCallback(() => {
        dispatch(setUser(null));
        dispatch(setProfile(null));
    }, []);

    useEffect(() => {
        if (drawerStatus == "open") {
            loadIndicator();
        }
    }, [drawerStatus]);

    const loadIndicator = useCallback(() => {
        console.log("Load status");
        PushNotificationUtils.getMessageIndicator(pubnub).then((status) => {
            console.log("getMessageIndicator", status);
            // setHasMessage(status);
            setHasMessage(status);
        });
        PushNotificationUtils.getNotificationIndicator(pubnub).then((status) => {
            console.log("getNotificationIndicator", status);
            setHasNotification(status);
        });
    }, [pubnub]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topWrapper}>
                    <Text style={styles.sidebarTitle}>Hello</Text>
                    <TouchableOpacity onPress={() => {
                        props.navigation.closeDrawer();
                    }}>
                        <MaterialCommunityIcons name="close" size={22} color={color.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.line} />

                <TouchableOpacity style={styles.profile}
                    activeOpacity={0.8}
                    onPress={() => {
                        props.navigation.closeDrawer();
                        props.navigation.navigate("Profile");
                    }}>
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
                                    <Text style={styles.trialBadgeText}>Gym: {gym?.name}</Text>
                                </View>
                            )}
                            {/* <MaterialCommunityIcons name="map-marker" size={15} color={color.text} />
                            <Text style={styles.profileLocation}>{profile?.student_campus_residential_address}</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.line} />

                {menus.map((item, index) => {
                    if (item == null) {
                        return <View style={styles.line} key={index} />
                    }
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.menu}
                            activeOpacity={0.9}
                            onPress={() => {
                                if (item.target != null) {
                                    props.navigation.closeDrawer();
                                    props.navigation.navigate(item.target);
                                }
                            }}>
                            {item.icon}
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            {item.type == "message" && hasMessage && (
                                <View style={styles.redDot} />
                            )}
                            {item.type == "notification" && hasNotification && (
                                <View style={styles.redDot} />
                            )}
                            {item.type == "push" && (
                                <Switch
                                    trackColor={{ false: color.primary + "20", true: color.primary + "20" }}
                                    thumbColor={pushEnabled ? color.primary : color.white}
                                    ios_backgroundColor={color.primary + "20"}
                                    onValueChange={() => {
                                        setPushEnabled(!pushEnabled);
                                    }}
                                    value={pushEnabled}
                                />
                            )}
                            {item.type == "email" && (
                                <Switch
                                    trackColor={{ false: color.primary + "20", true: color.primary + "20" }}
                                    thumbColor={emailEnabled ? color.primary : color.white}
                                    ios_backgroundColor={color.primary + "20"}
                                    onValueChange={() => {
                                        setEmailEnabled(!emailEnabled);
                                    }}
                                    value={emailEnabled}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.line} />

                <TouchableOpacity
                    style={styles.menu}
                    activeOpacity={0.9}
                    onPress={() => {
                        props.navigation.closeDrawer();
                        if (Platform.OS == 'web') {
                            window.confirm("Are you sure you want to logout?") && logout();
                        } else {
                            setIsShowLogout(true);
                            /*
                            Alert.alert(
                                'Information',
                                'Are you sure want to logout?',
                                [
                                    { text: 'No', onPress: () => { }, style: 'cancel' },
                                    {
                                        text: 'Yes', onPress: () => {
                                            logout();

                                            setIsShowLogout(true);
                                        }
                                    },
                                ],
                                { cancelable: false }
                            );
                            */
                        }
                    }}>
                    <MaterialCommunityIcons name="exit-to-app" size={30} color={color.text} />
                    <Text style={styles.logoutButton}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            <SimpleModal
                visible={isShowLogout}
                onRequestClose={() => {
                    setIsShowLogout(false);
                }}>
                <View style={styles.logoutHeader}>
                    <AntDesign name="logout" size={20} color={color.primary} />
                    <Text style={styles.logoutHeaderText}>Logout</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.logoutContent}>
                    <Text style={styles.logoutText}>Your are leaving..</Text>
                    <Text style={styles.logoutText}>Are you sure ?</Text>

                    <Button
                        style={{ marginVertical: 10 }}
                        onPress={() => {
                            logout();
                        }}>Logout</Button>

                    <Button
                        theme='secondary'
                        onPress={() => {
                            setIsShowLogout(false);
                        }}>Cancel</Button>

                </View>
            </SimpleModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logoutHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    logoutHeaderText: {
        fontSize: 18,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
        marginLeft: 10,
    },
    logoutContent: {
        paddingHorizontal: 20,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
        textAlign: 'center',
    },



    container: {
        backgroundColor: color.white,
        paddingVertical: 20,
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
        fontSize: 16,
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
    topWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sidebarTitle: {
        fontSize: 18,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
        flex: 1,
    },

    redDot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: color.danger,
    },

    line: {
        height: 1,
        backgroundColor: "rgba(60, 60, 67, 0.36)",
        marginBottom: 20,
    },
    menu: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    menuLabel: {
        fontSize: 16,
        color: color.text,
        flex: 1,
        marginLeft: 10,
    },
    logoutButton: {
        fontSize: 16,
        color: color.primary,
        marginLeft: 10,
    }
});