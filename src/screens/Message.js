import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
import NoData from '../components/NoData';
import { useFocusEffect } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuView } from '@react-native-menu/menu';
import CacheUtils from '../utils/CacheUtils';
import ImageUtils from '../utils/ImageUtils';
import PushNotificationUtils from '../utils/PushNotificationUtils';
import LoadingIndicator from '../components/LoadingIndicator';
import { HttpUtils } from '../utils/http';

export default function Message(props) {
    const pubnub = usePubNub();
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile);
    const profiles = useSelector((state) => state.profiles);

    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [fcmToken, setFcmToken] = useState('');
    const [channelIds, setChannelIds] = useState([]);

    useEffect(() => {
        PushNotificationUtils.getToken().then((token) => {
            console.log("Token", token);

            setFcmToken(token);
        }).catch((err) => {
            console.log("Token Err", err);
        })
    }, [profile]);

    useEffect(() => {
        if (fcmToken != '' && channelIds.length != 0) {
            let _channelIds = [...channelIds];
            PushNotificationUtils.registerDevice(pubnub, fcmToken, _channelIds);
        }
    }, [fcmToken, channelIds]);

    useFocusEffect(useCallback(() => {
        getMembership();
    }, []));

    const getMembership = useCallback(() => {
        setIsLoading(true);
        pubnub.objects.getMemberships({
            uuid: profile.user.id + "",
            include: {
                totalCount: true,
                customFields: true,
                channelFields: true,
                customChannelFields: true,
            },
            sort: { "channel.updated": "desc" }
        }).then((res) => {
            console.log("getMembership", res);

            let channelIds = ["notification." + profile.user.id];

            let result = res.data.map((message) => {
                if (message.channel.name == "[DIRECT]") {
                    let { member_1, member_2 } = message.channel.custom;
                    CacheUtils.findProfile(member_1, dispatch);
                    CacheUtils.findProfile(member_2, dispatch);

                    message.other_profile = profile.user.id + '' == member_1 ? member_2 : member_1;
                }

                channelIds.push(message.channel.id);

                return message;
            })

            setChannels(result);
            setChannelIds(channelIds);
            setIsLoading(false);
        })
    }, [pubnub, profile]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Messages"
                onLeftClick={() => {
                    props.navigation.openDrawer();
                }}
                rightIcon={
                    // <MenuView
                    //     title="New Message"
                    //     onPressAction={({ nativeEvent }) => {
                    //         if (nativeEvent.event == "private") {
                    //             props.navigation.navigate("MessageCreateDirect");
                    //         } else {
                    //             props.navigation.navigate("MessageCreateGroup");
                    //         }
                    //     }}
                    //     actions={[
                    //         {
                    //             id: 'private',
                    //             title: 'Private Message',
                    //             titleColor: color.black,
                    //             subtitle: 'Send private message to a trainer',
                    //         },
                    //         {
                    //             id: 'group',
                    //             title: 'Group Message',
                    //             titleColor: color.black,
                    //             subtitle: 'Create a group with some members',
                    //         },
                    //     ]}
                    //     shouldOpenOnLongPress={false}
                    // >
                    //     <MaterialCommunityIcons name='plus' size={25} color={color.white} />
                    // </MenuView>
                    <MaterialCommunityIcons name='plus' size={25} color={color.white} />
                }
                onRightClick={() => {
                    props.navigation.navigate("MessageCreateDirect");
                }}
            />

            <ScrollView refreshControl={
                <RefreshControl refreshing={false}
                    onRefresh={getMembership} />}>
                <View style={styles.content}>
                    {isLoading && <LoadingIndicator />}

                    {!isLoading && (
                        <>
                            {channels.length == 0 && <NoData>No Message Available</NoData>}
                            {channels.map((message, index) => {
                                let otherUser = null;
                                if (message.other_profile) {
                                    otherUser = profiles[message.other_profile];
                                }
                                let image = HttpUtils.normalizeUrl(otherUser.profile_image);
                                let totalMember = message.channel.custom?.total_member ?? 1;

                                let lastMessage = message.channel.custom?.lastMessage ?? "(N/A)";

                                return (
                                    <TouchableOpacity style={styles.message} key={index} onPress={() => {
                                        if (message.other_profile) {
                                            props.navigation.navigate("MessagePrivate", {
                                                message,
                                            });
                                        } else {
                                            props.navigation.navigate("MessageDetail", {
                                                message,
                                            });
                                        }
                                    }}>
                                        {image == null && <Image source={ImageUtils.defaultImage} style={styles.image} resizeMode='cover' />}
                                        {image != null && <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />}
                                        <View style={styles.messageContent}>
                                            <View style={styles.titleRow}>
                                                <Text style={styles.title}>{otherUser ? otherUser.user.name : message.channel.name}</Text>
                                                <Text style={styles.time}>{moment(message.channel.updated).utc().fromNow()}</Text>
                                            </View>
                                            <Text style={styles.description}>{lastMessage}</Text>
                                            {/* <Text style={styles.description}>{totalMember} member{totalMember != 1 ? "s" : ""}</Text> */}
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={20} color={color.black} />
                                    </TouchableOpacity>
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
        paddingHorizontal: 20,
    },
    message: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.gray,
        marginTop: 10,
    },
    messageContent: {
        flex: 1,
        marginLeft: 10,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.black,
        flex: 1,
    },
    time: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.gray,
    },
    description: {
        fontSize: 14,
        // fontWeight: '400',
        fontFamily: font.sourceSansPro,
        color: color.primary,
    },
};