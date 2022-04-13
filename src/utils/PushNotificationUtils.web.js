import { Platform } from "react-native";

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
    }
}   