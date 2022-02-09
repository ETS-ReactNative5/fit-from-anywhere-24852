import React, { useCallback, useMemo, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView
} from "react-native";
import color from "../utils/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/actions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { font } from "../utils/font";

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
    },
    {
        icon: <MaterialCommunityIcons name="bell" size={30} color={color.text} />,
        label: "Notifications",
        target: "Notification",
    },
    {
        icon: <MaterialCommunityIcons name="dumbbell" size={30} color={color.text} />,
        label: "Workout Library",
        target: "Workout",
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
    },
    {
        icon: <MaterialCommunityIcons name="email-alert" size={30} color={color.text} />,
        label: "Email notifications",
        target: null,
    },
];

export default function Sidebar(props) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    //console.log("SideMenu:User", user);

    const logout = useCallback(() => {
        dispatch(setUser(null));
        // props.navigation.navigate("Auth");
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.profile}
                    activeOpacity={0.8}
                    onPress={() => {
                        props.navigation.closeDrawer();
                        props.navigation.navigate("Profile");
                    }}>
                    <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
                    <View style={styles.profileContent}>
                        <Text style={styles.profileName}>{user?.user.name}</Text>
                        <View style={styles.profileInfo}>
                            <MaterialCommunityIcons name="map-marker" size={15} color={color.text} />
                            <Text style={styles.profileLocation}>Los Angeles, CA</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.line} />

                {userMenus.map((item, index) => {
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
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.line} />

                <TouchableOpacity
                    style={styles.menu}
                    activeOpacity={0.9}
                    onPress={() => {
                        props.navigation.closeDrawer();
                        Alert.alert(
                            'Information',
                            'Are you sure want to logout?',
                            [
                                { text: 'No', onPress: () => { }, style: 'cancel' },
                                {
                                    text: 'Yes', onPress: () => {
                                        logout();
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    }}>
                    <MaterialCommunityIcons name="exit-to-app" size={30} color={color.text} />
                    <Text style={styles.logoutButton}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        paddingVertical: 20,
        flex: 1,
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