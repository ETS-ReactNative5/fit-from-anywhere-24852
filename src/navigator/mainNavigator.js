import React, { useEffect, useMemo } from "react"
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreen from "../screens/SplashScreen";
import Home from "../screens/Home";
import { useDispatch, useSelector } from "react-redux";
import Walkthrough from "../screens/Walkthrough";
import Intro from "../screens/Intro";
import Register from "../screens/Register";
import Onboarding from "../screens/Onboarding";
import Login from "../screens/Login";
import Sidebar from "./Sidebar";
import Profile from "../screens/Profile";
import Workout from "../screens/Workout";
import Resource from "../screens/Resource";
import Appointment from "../screens/Appointment";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import TermAndCondition from "../screens/TermAndCondition";
import Notification from "../screens/Notification";
import Message from "../screens/Message";
import AppointmentEdit from "../screens/AppointmentEdit";
import app from "../config/app";
import MessageCreateGroup from "../screens/MessageCreateGroup";
import MessageEditGroupInfo from "../screens/MessageEditGroupInfo";
import MessageDetail from "../screens/MessageDetail";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeNavigator = () => {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => {
            return <Sidebar {...props} />
        }}>
            <Drawer.Screen name="Home" component={Home} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Onboarding" component={Onboarding} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Profile" component={Profile} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Message" component={Message} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Notification" component={Notification} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Workout" component={Workout} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Resource" component={Resource} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="Appointment" component={Appointment} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={() => ({ headerShown: false })} />
            <Drawer.Screen name="TermAndCondition" component={TermAndCondition} options={() => ({ headerShown: false })} />
        </Drawer.Navigator>
    );
}

const AuthTab = () => {
    return (
        <Tab.Navigator tabBar={() => null}>
            <Tab.Screen name="Intro" component={Intro} options={() => ({ headerShown: false })} />
            <Tab.Screen name="Register" component={Register} options={() => ({ headerShown: false })} />
            <Tab.Screen name="Login" component={Login} options={() => ({ headerShown: false })} />
        </Tab.Navigator>
    );
}

const DashboardStack = () => {
    return (
        <Stack.Navigator initialRouteName="HomeStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeStack" component={HomeNavigator} />
            <Stack.Screen name="AppointmentEdit" component={AppointmentEdit} />
            <Stack.Screen name="MessageCreateGroup" component={MessageCreateGroup} />
            <Stack.Screen name="MessageEditGroupInfo" component={MessageEditGroupInfo} />
            <Stack.Screen name="MessageDetail" component={MessageDetail} />
        </Stack.Navigator>
    );
}

export default function AppContainer() {
    const user = useSelector((state) => state.user);
    const profile = useSelector((state) => state.profile);
    const splash = useSelector((state) => state.splash);

    const pubnub = useMemo(() => {
        if (profile && profile?.user?.id != null) {
            return new PubNub({
                publishKey: app.PUBNUB_PUB_KEY,
                subscribeKey: app.PUBNUB_SUB_KEY,
                uuid: profile?.user?.id + ""
            });
        }

        return null;
    }, [profile]);

    //console.log("SplashScreen", splash);

    // useEffect(() => {
    //     console.log("User changed", user);
    // }, [user]);

    // useEffect(() => {
    //     console.log("splash changed", splash);
    // }, [splash]);

    if (splash === true) {
        return <SplashScreen />
    } else {
        if (user != null && pubnub != null) {
            return (
                <PubNubProvider client={pubnub}>
                    <NavigationContainer>
                        <Tab.Navigator tabBar={() => null}>
                            <Tab.Screen name="Dashboard" component={DashboardStack} options={() => ({ headerShown: false })} />
                        </Tab.Navigator>
                    </NavigationContainer>

                </PubNubProvider>
            )
        } else {
            return (
                <NavigationContainer>
                    <Tab.Navigator tabBar={() => null}>
                        <Tab.Screen name="Auth" component={AuthTab} options={() => ({ headerShown: false })} />

                    </Tab.Navigator>
                </NavigationContainer>
            )
        }
    }
}