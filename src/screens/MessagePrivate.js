import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    View,
    TextInput,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import NoData from '../components/NoData';
import { usePubNub } from 'pubnub-react';
import Toast from '../components/Toast';
import { useDispatch, useSelector } from 'react-redux';
import CacheUtils from '../utils/CacheUtils';
import { HttpUtils } from '../utils/http';
import ImageUtils from '../utils/ImageUtils';
import PushNotificationUtils from '../utils/PushNotificationUtils';
import Feather from 'react-native-vector-icons/dist/Feather';
import SimpleModal from '../components/SimpleModal';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';

export default function MessagePrivate(props) {
    const pubnub = usePubNub();
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile);
    const profiles = useSelector((state) => state.profiles);

    const params = props.route.params.message;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [channelMetaData, setChannelMetaData] = useState(null);

    const [messageSubject, setMessageSubject] = useState("");
    const [messageSubjectTemporary, setMessageSubjectTemporary] = useState("");
    const [isShowMessageSubjectPopup, setIsShowMessageSubjectPopup] = useState(false);

    const scrollView = useRef(null);

    const messageSubjects = useMemo(() => {
        return [
            { label: "Appointments" },
            { label: "Exercise suggestions" },
            { label: "Gym equipments" },
            { label: "Other" },
        ];
    }, []);

    useEffect(() => {
        const listener = { message: handleMessage };

        pubnub.addListener(listener);
        pubnub.subscribe({ channels: [params.channel.id] });

        fetchChannelMetadata();
        fetchMessage();

        return () => {
            pubnub.removeListener(listener);
            pubnub.unsubscribeAll();
        };
    }, [pubnub, params]);

    const fetchChannelMetadata = useCallback(() => {
        pubnub.objects.getChannelMetadata({
            channel: params.channel.id,
        }).then((res) => {
            console.log("Get metadata success", res.data.custom);
            setChannelMetaData(res.data.custom);
        }).catch((err) => {
            console.log("Err", err.status);
        });
    }, [params, pubnub]);

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

                        let text = message.message;
                        let subject = null;
                        if (!(typeof text === 'string' || text instanceof String)) {
                            subject = text.subject;
                            text = text.text;
                        }

                        if (subject == '') {
                            subject = null;
                        }

                        return {
                            uuid: message.uuid,
                            message: text,
                            subject,
                            created_at: moment(message.timetoken / 10000).format("YYYY-MM-DD HH:mm:ss"),
                        };
                    });
                    console.log(_messages);
                    setMessages(_messages);

                    scrollView.current.scrollToEnd({ animated: true })
                } else {
                    Toast.showError(status.errorData.message);
                }
            }
        );
    }, [pubnub, params, scrollView]);

    const sendMessage = useCallback(() => {
        setMessage("");

        let _message = PushNotificationUtils.getPushNotifObject(profile.user.name, message);
        _message.text = message;
        _message.subject = messageSubject;

        console.log("Message", _message);

        channelMetaData.lastMessage = message;

        pubnub.publish({ channel: params.channel.id, message: _message }).then((res) => {
            console.log("Message sent", res);

            //update last message
            pubnub.objects.setChannelMetadata({
                channel: params.channel.id,
                data: {
                    custom: channelMetaData,
                },
                include: {
                    customFields: true,
                },
            }).then((res) => {
                console.log("Set metadata success", res);
            }).catch((err) => {
                console.log("Err", err.status);
            });
        }).catch((err) => {

        });
    }, [params, profile, message, messageSubject, channelMetaData]);

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
            <Header title="Direct message"
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }}
                rightIcon={<MaterialCommunityIcons name='delete-outline' size={25} color={color.white} />}
                onRightClick={() => {
                    deleteChannel();
                }}
            />

            <View style={styles.userProfile}>
                {otherUser.profile_image == null && <Image source={ImageUtils.defaultImage} style={styles.userImage} resizeMode='cover' />}
                {otherUser.profile_image != null && <Image source={{ uri: HttpUtils.normalizeUrl(otherUser.profile_image) }} style={styles.userImage} resizeMode='cover' />}
                <View style={styles.userProfileContent}>
                    <Text style={styles.userProfileName}>{otherUser?.user.name}</Text>
                </View>
                <TouchableOpacity style={styles.phoneButton} activeOpacity={1}>
                    <Feather name="phone" size={20} color={color.primary + '50'} />
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollView}
                onContentSizeChange={() => scrollView.current.scrollToEnd({ animated: true })}>
                <View style={styles.content}>
                    {messages.map((message, index) => {
                        let user = profiles[message.uuid];
                        let image = HttpUtils.normalizeUrl(user?.profile_image);

                        if (profile.user.id == message.uuid) {
                            return (
                                <View style={styles.messageRight} key={index}>
                                    <View style={styles.messageContent}>
                                        {message.subject != null && <Text style={styles.messageSubject}>{message.subject}</Text>}
                                        <Text style={styles.messageText}>{message.message}</Text>

                                        <Text style={styles.time}>{moment(message.created_at).format('MMM DD, hh:mm a')}</Text>
                                    </View>
                                    <View style={{ width: 10 }} />
                                    {image == null && <Image source={ImageUtils.defaultImage} style={styles.image} resizeMode='cover' />}
                                    {image != null && <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />}
                                </View>
                            );
                        } else {
                            return (
                                <View style={styles.messageLeft} key={index}>
                                    {image == null && <Image source={ImageUtils.defaultImage} style={styles.image} resizeMode='cover' />}
                                    {image != null && <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />}
                                    <View style={{ width: 10 }} />
                                    <View style={styles.messageContent}>
                                        {message.subject != null && <Text style={styles.messageSubject}>{message.subject}</Text>}
                                        <Text style={styles.messageText}>{message.message}</Text>

                                        <Text style={styles.time}>{moment(message.created_at).format('MMM DD, hh:mm a')}</Text>
                                    </View>
                                </View>
                            );
                        }
                    })}
                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>

            <KeyboardAvoidingView behavior={"padding"} enabled={Platform.OS == 'ios'}>
                <TouchableOpacity style={styles.messageSubjectWrapper} onPress={() => {
                    setIsShowMessageSubjectPopup(true);
                    setMessageSubjectTemporary(messageSubject);
                }}>
                    {messageSubject == '' && <Text style={styles.messageSubject}>Message subject</Text>}
                    {messageSubject != '' && <Text style={styles.messageSubject}>{messageSubject}</Text>}
                    <MaterialCommunityIcons name="chevron-down" size={20} color={color.primary} />
                </TouchableOpacity>
                <View style={styles.bottomWrap}>
                    <TouchableOpacity style={styles.buttonAttachment} onPress={() => {

                    }}>
                        <MaterialCommunityIcons name="camera" size={25} color={color.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonAttachment} onPress={() => {

                    }}>
                        <Feather name="paperclip" size={25} color={color.primary} />
                    </TouchableOpacity>

                    <View style={styles.textInputWrap}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type a message"
                            value={message}
                            onChangeText={setMessage}
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                sendMessage();
                            }} />
                    </View>

                    <TouchableOpacity style={styles.buttonAttachment} onPress={() => {
                        sendMessage();
                    }}>
                        <Ionicons name="send-outline" size={25} color={color.primary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <SimpleModal
                visible={isShowMessageSubjectPopup}
                onRequestClose={() => {
                    setIsShowMessageSubjectPopup(false);
                }}>
                {messageSubjects.map((subject, index) => {
                    return (
                        <TouchableOpacity style={styles.messageSubjectItem} key={index}
                            activeOpacity={0.8}
                            onPress={() => {
                                setMessageSubjectTemporary(subject.label);
                            }}>
                            <CheckBox
                                value={subject.label == messageSubjectTemporary ? true : false}
                                title={subject.label}
                            />
                        </TouchableOpacity>
                    );
                })}

                <Button
                    style={{ marginTop: 20 }}
                    onPress={() => {
                        setIsShowMessageSubjectPopup(false);
                        setMessageSubject(messageSubjectTemporary);
                    }}>Update Subject</Button>
            </SimpleModal>
        </SafeAreaView>


    );
}

const styles = {
    //place this to bottom
    messageSubjectWrapper: {
        flexDirection: 'row',
        paddingLeft: 100,
        paddingRight: 70,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingTop: 8,
    },
    messageSubject: {
        flex: 1,
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.primary,
    },
    messageSubjectItem: {
        marginBottom: 10,
    },
    bottomWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonAttachment: {
        paddingHorizontal: 5,
    },
    textInputWrap: {
        backgroundColor: '#E5EBEE',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        minHeight: 40,
        marginHorizontal: 10,
    },


    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
    },
    messageLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    messageRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    image: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    messageContent: {
        backgroundColor: "#E5EBEE",
        borderRadius: 8,
        padding: 10,
    },
    title: {
        fontSize: 12,
        color: color.black,
        fontWeight: '600',
    },
    time: {
        fontFamily: font.sourceSansPro,
        fontSize: 10,
        color: '#666',
    },
    messageSubject: {
        fontFamily: font.sourceSansPro,
        fontSize: 12,
        color: color.primary,
        marginBottom: 2,
    },
    messageText: {
        fontWeight: '400',
        fontSize: 14,
        color: color.black,
        marginBottom: 5,
    },



    userProfile: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    userProfileContent: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    userProfileName: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.primary,
    },
    phoneButton: {
        justifyContent: 'center',
        paddingHorizontal: 20,
    }
};