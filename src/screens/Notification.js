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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import NoData from '../components/NoData';
import { usePubNub } from 'pubnub-react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Toast from '../components/Toast';
import LoadingIndicator from '../components/LoadingIndicator';

// const notifications = [
//     {
//         title: "Congratulations!",
//         description: "You have registered as a member",
//         created: "2022-01-01 13:45:22",
//     },
//     {
//         title: "Congratulations!",
//         description: "You have registered as a member",
//         created: "2022-01-01 13:45:22",
//     },
//     {
//         title: "Congratulations!",
//         description: "You have registered as a member",
//         created: "2022-01-01 13:45:22",
//     },
//     {
//         title: "Congratulations!",
//         description: "You have registered as a member",
//         created: "2022-01-01 13:45:22",
//     },
//     {
//         title: "Congratulations!",
//         description: "You have registered as a member",
//         created: "2022-01-01 13:45:22",
//     }
// ];

export default function Notification(props) {
    const pubnub = usePubNub();
    const profile = useSelector((state) => state.profile);

    const [messages, setMessages] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useFocusEffect(useCallback(() => {
        loadNotification();
    }, []));

    const loadNotification = useCallback(() => {
        setLoading(true);
        let channelName = "notification." + profile.user.id;

        pubnub.fetchMessages(
            {
                channels: [channelName],
                count: 20
            }, (status, response) => {
                console.log({ status, response });
                if (status.statusCode == 200) {
                    let _messages = response.channels[channelName] ?? [];
                    _messages = _messages.map(message => {
                        let text = message.message;
                        if (!(typeof text === 'string' || text instanceof String)) {
                            text = text.text;
                        }

                        return {
                            uuid: message.uuid,
                            message: text,
                            created_at: moment(message.timetoken / 10000).format("YYYY-MM-DD HH:mm:ss"),
                        };
                    });
                    setMessages(_messages);
                } else {
                    Toast.showError(status.errorData.message);
                }

                setLoading(false);
            }
        );
    }, [pubnub, profile]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Notifications" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                {isLoading && (
                    <LoadingIndicator />
                )}

                {!isLoading && (
                    <>
                        {messages.length == 0 && <NoData>No Notifications Available</NoData>}
                        {messages.map((notification, index) => {
                            return (
                                <View key={index} style={styles.notification}>
                                    <View style={styles.checkbox}>

                                    </View>
                                    <View style={styles.content}>
                                        <View style={styles.titleRow}>
                                            <Text style={styles.title}>{notification.message}</Text>
                                            <Text style={styles.time}>{moment(notification.created_at).fromNow()}</Text>
                                        </View>
                                        {/* <Text style={styles.description}>{notification.description}</Text> */}
                                    </View>
                                </View>
                            );
                        })}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    notification: {
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 51, 88, 0.1)',
        paddingVertical: 20,
        flexDirection: 'row',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: color.border,
        marginRight: 10,
        marginTop: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
    },
    time: {
        fontSize: 13,
        fontFamily: font.sourceSansPro,
        color: color.black,
    }
};