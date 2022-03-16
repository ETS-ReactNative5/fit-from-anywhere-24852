import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import NoData from '../components/NoData';
import TextInput from '../components/TextInput';
import { usePubNub } from 'pubnub-react';
import Toast from '../components/Toast';
import { useDispatch, useSelector } from 'react-redux';
import CacheUtils from '../utils/CacheUtils';
import { HttpUtils } from '../utils/http';
import ImageUtils from '../utils/ImageUtils';
import PushNotificationUtils from '../utils/PushNotificationUtils';

export default function MessageDetail(props) {
    const pubnub = usePubNub();
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile);
    const profiles = useSelector((state) => state.profiles);

    const params = props.route.params.message;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        const listener = { message: handleMessage };

        pubnub.addListener(listener);
        pubnub.subscribe({ channels: [params.channel.id] });

        fetchMessage();

        return () => {
            pubnub.removeListener(listener);
            pubnub.unsubscribeAll();
        };
    }, [pubnub, params]);

    const handleMessage = useCallback((event) => {
        console.log("Event", event);
        fetchMessage();
    }, []);

    const fetchMessage = useCallback(() => {
        pubnub.fetchMessages(
            {
                channels: [params.channel.id],
                count: 100
            }, (status, response) => {
                console.log({ status, response });
                if (status.statusCode == 200) {
                    let _messages = response.channels[params.channel.id];
                    _messages = _messages.map(message => {
                        CacheUtils.findProfile(message.uuid, dispatch);
                        return {
                            uuid: message.uuid,
                            message: message.message,
                            created_at: moment(message.timetoken / 10000).format("YYYY-MM-DD HH:mm:ss"),
                        };
                    });
                    console.log(_messages);
                    setMessages(_messages);
                } else {
                    Toast.showError(status.errorData.message);
                }
            }
        );
    }, [params]);

    const sendMessage = useCallback(() => {
        setMessage("");

        let _message = PushNotificationUtils.getPushNotifObject(profile.name, message);
        _message.text = params.channel.id;

        pubnub.publish({ channel: params.channel.id, message }).then((res) => {
            console.log("Message sent", res);
        }).catch((err) => {

        });
    }, [params, profile, message]);

    const deleteChannel = useCallback(() => {
        Alert.alert(
            'Information',
            'Are you sure want to leave this chat room ?',
            [
                { text: 'No', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        pubnub.objects.removeMemberships({ channels: [params.channel.id] }).then((res) => {
                            console.log("Channel deleted", res);
                            Toast.showSuccess("Channel deleted");
                            props.navigation.goBack();
                        }).catch((err) => {
                            console.log(err, err.response);
                            Toast.showError(HttpResponse.processMessage(err.response, "Cannot delete channel"));
                        });
                    }
                },
            ],
            { cancelable: false }
        );
    }, [pubnub, params]);

    let otherUser = null;
    if (params.other_profile) {
        otherUser = profiles[params.other_profile];
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={otherUser ? otherUser.user.name : params.channel.name}
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }}
                rightIcon={<MaterialCommunityIcons name='delete-outline' size={25} color={color.white} />}
                onRightClick={() => {
                    deleteChannel();
                }}
            />
            <ScrollView>
                <View style={styles.content}>
                    {messages.map((message, index) => {
                        let user = profiles[message.uuid];
                        let image = HttpUtils.normalizeUrl(user?.profile_image);
                        return (
                            <View style={styles.message} key={index}>
                                {image == null && <Image source={ImageUtils.defaultImage} style={styles.image} resizeMode='cover' />}
                                {image != null && <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />}
                                <View style={styles.messageContent}>
                                    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                                        <Text style={styles.title}>{user?.user.name}</Text>
                                        <Text style={styles.time}>{moment(message.created_at).format('hh:mm a')}</Text>
                                    </View>

                                    <Text style={styles.messageText}>{message.message}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <KeyboardAvoidingView behavior="padding">
                <View style={styles.bottomWrap}>
                    <TextInput
                        placeholder="Message"
                        value={message}
                        onChangeText={setMessage}
                        returnKeyType="send"
                        onSubmitEditing={() => {
                            sendMessage();
                        }} />
                </View>
            </KeyboardAvoidingView>
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
        marginTop: 20,
    },
    image: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    messageContent: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 12,
        color: color.black,
        fontWeight: '600',
    },
    time: {
        fontWeight: '400',
        fontSize: 12,
        color: color.black,
        marginLeft: 10,
    },
    messageText: {
        fontWeight: '400',
        fontSize: 12,
        color: color.black,
    },

    bottomWrap: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
};