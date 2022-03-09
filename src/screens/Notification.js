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
    const [notifications, setNotifications] = useState([]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Notifications" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                {notifications.length == 0 && <NoData>No Notifications Available</NoData>}
                {notifications.map((notification, index) => {

                    return (
                        <View key={index} style={styles.notification}>
                            <View style={styles.checkbox}>

                            </View>
                            <View style={styles.content}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.title}>{notification.title}</Text>
                                    <Text style={styles.time}>{moment(notification.created).fromNow()}</Text>
                                </View>
                                <Text style={styles.description}>{notification.description}</Text>
                            </View>
                        </View>
                    );
                })}
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