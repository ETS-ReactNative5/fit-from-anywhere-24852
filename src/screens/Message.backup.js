import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NoData from '../components/NoData';
import { usePubNub } from 'pubnub-react';
import Button from '../components/Button';
import { useSelector } from 'react-redux';

export default function MessageBackup(props) {
    const pubnub = usePubNub();
    const profile = useSelector((state) => state.profile);
    const channels = ["test.group1"];

    useEffect(() => {
        pubnub.addListener({ message: handleMessage });
        pubnub.subscribe({ channels });
    }, [pubnub, channels]);

    const handleMessage = useCallback((event) => {
        console.log("Event", event);
    }, []);

    const sendMessage = useCallback(() => {
        pubnub.publish({
            message: "Hello There from Mobile",
            channel: "test.group1",
        }).then((res) => {
            console.log("Publish", res);
        }).catch((err) => {
            console.log("Err", err);
        });
    }, [pubnub, channels]);

    const getMembership = useCallback(() => {
        pubnub.objects.getMemberships({
            uuid: profile.user.id + "",
            include: {
                customFields: true,
                channelFields: true,
                customChannelFields: true,
            },
            sort: { "channel.updated": "desc" }
        }).then((res) => {
            console.log("getMembership", res);
        })
    }, [pubnub, profile, channels]);

    const setMembership = useCallback(() => {
        pubnub.objects.setMemberships({
            uuid: profile.user.id + "",
            channels: channels,
        }).then((res) => {
            console.log("setMemberships", res);
        })
    }, [pubnub, profile, channels]);



    const getChannelMembers = useCallback(() => {
        pubnub.objects.getChannelMembers({
            channel: channels[0],
        }).then((res) => {
            console.log("getChannelMembers", res);
        })
    }, [pubnub, profile, channels]);

    const setChannelMetadata = useCallback(() => {
        pubnub.objects.setChannelMetadata({
            channel: channels[0],
            data: {
                name: "Family Group",
                description: "This is group Channel",
                custom: {
                    image: "https://place-hold.it/300",
                },
            },
            include: {
                customFields: true,
            },
        }).then((res) => {
            console.log("setChannelMetadata", res);
        })
    }, [pubnub, profile, channels]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Direct Messages" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <NoData>No Message Available</NoData>
            </ScrollView>

            <Button onPress={setChannelMetadata}>Set Channel Metadata</Button>

            <Button onPress={getChannelMembers}>Get Channel Member</Button>

            <Button onPress={setMembership}>Set Membership</Button>
            <Button onPress={getMembership}>Get Membership</Button>
            <Button onPress={sendMessage}>Send Message</Button>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
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
};