import { store } from "../store";

export default {
    getToken() {
        return new Promise(async (resolve, reject) => {
            resolve("");
        });
    },

    registerDevice(pubnub, deviceToken, channels) {
        
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