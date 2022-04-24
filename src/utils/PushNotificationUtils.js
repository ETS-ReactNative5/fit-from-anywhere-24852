import { Platform } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { store } from "../store";

export default {
    getToken() {
        return new Promise(async (resolve, reject) => {
            if (Platform.OS === 'ios') {
                const authorizationStatus = await messaging().requestPermission();

                if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                    console.log('User has notification permissions enabled.');
                } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
                    console.log('User has provisional notification permissions.');
                } else {
                    console.log('User has notification permissions disabled');
                }

                try {
                    let registerFirebase = await messaging().registerDeviceForRemoteMessages();
                    console.log("RegisterFirebase", registerFirebase);
                } catch (err) {
                    console.log("RegisterFirebaseErr", err);
                    reject(err);
                }
            }

            let registration_id = await messaging().getToken();
            console.log("Registrationid", registration_id);

            resolve(registration_id);
        });
    },

    registerDevice(pubnub, deviceToken, channels) {
        console.log("RegisterDevice", { pubnub, deviceToken, channels });

        // FCM
        pubnub.push.addChannels({
            channels: channels,
            device: deviceToken,
            pushGateway: "gcm",
        }, (status) => {
            console.log("addChannels", status);
        });

        // APNs2
        pubnub.push.addChannels({
            channels: channels,
            device: deviceToken,
            pushGateway: "apns2",
            environment: "production", // Required for APNs2
            topic: "com.domainname.fit-forever-from-an-24852" // Required for APNs2
        }, (status) => {
            console.log("addChannels2", status);
        });
    },

    uploadFile(obj) {
        let { uri, name, mimeType, pubnub, channel } = obj;

        return new Promise((resolve, reject) => {
            pubnub.sendFile({
                channel: channel,
                file: {
                    uri,
                    name,
                    mimeType,
                },
            }).then((res) => {
                console.log("SendFile", res);

                const result = pubnub.getFileUrl({ channel, id: res.id, name: res.name });
                resolve(result);
            }).catch(err => {
                console.log("Err:sendFile", err);
                reject("Cannot upload file");
            });
        });
    },

    getPushNotifObject(title, message) {
        return {
            "pn_apns": {
                "aps": {
                    "alert": {
                        "title": title,
                        "body": message
                    }
                },
                "pn_push": [
                    {
                        "push_type": "alert",
                        "targets": [
                            {
                                "environment": "production",
                                "topic": "com.domainname.fit-forever-from-an-24852"
                            }
                        ],
                        "version": "v2"
                    }
                ]
            },
            "pn_gcm": {
                "notification": {
                    "title": title,
                    "body": message,
                    "sound": "default"
                }
            },
        };
    },

    sendChatNotification(pubnub, targetId, title, message) {
        const messagePayload = {
            "pn_apns": {
                "aps": {
                    "alert": {
                        "title": title,
                        "body": message
                    }
                },
                "pn_push": [
                    {
                        "push_type": "alert",
                        "targets": [
                            {
                                "environment": "production",
                                "topic": "com.domainname.fit-forever-from-an-24852"
                            }
                        ],
                        "version": "v2"
                    }
                ]
            },
            "pn_gcm": {
                "notification": {
                    "title": title,
                    "body": message,
                    "sound": "default"
                }
            },
            "text": message
        };

        pubnub.publish({
            message: messagePayload,
            channel: 'notification.' + targetId,
        }, (status) => {
            console.log("publish", status);
        });
    },

    getNotificationIndicator(pubnub) {
        return new Promise((resolve, reject) => {
            const user = store.getState().user;
            pubnub.objects.getChannelMetadata({
                channel: 'notification.' + user.user.id,
            }).then((res) => {
                console.log("Get metadata success", res.data.custom);
                let custom = res.data.custom;
                if (custom && custom.indicator) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                console.log("Get metadata error", err.status);
                resolve(false);
            });
        });
    },

    setNotificationIndicator(pubnub, targetId, indicator = true) {
        return new Promise((resolve, reject) => {
            pubnub.objects.setChannelMetadata({
                channel: 'notification.' + targetId,
                data: {
                    custom: {
                        indicator,
                    },
                },
                include: {
                    customFields: true,
                },
            }).then((res) => {
                resolve();
            }).catch((err) => {
                reject(err.status);
            });
        });
    },

    getMessageIndicator(pubnub) {
        return new Promise((resolve, reject) => {
            const user = store.getState().user;
            console.log("Channel", 'message.' + user.user.id);
            pubnub.objects.getChannelMetadata({
                channel: 'message.' + user.user.id,
            }).then((res) => {
                console.log("Get metadata success", res.data.custom);
                let custom = res.data.custom;
                if (custom && custom.indicator) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                console.log("Get metadata error", err.status);
                resolve(false);
            });
        });
    },

    setMessageIndicator(pubnub, targetId, indicator = true) {
        return new Promise((resolve, reject) => {
            pubnub.objects.setChannelMetadata({
                channel: 'message.' + targetId,
                data: {
                    custom: {
                        indicator,
                    },
                },
                include: {
                    customFields: true,
                },
            }).then((res) => {
                resolve();
            }).catch((err) => {
                reject(err.status);
            });
        });
    },
}   