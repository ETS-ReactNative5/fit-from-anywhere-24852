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

const appointments = [
    { label: "Practice online", time: "2022-01-01T09:30:00.000Z" },
    { label: "Morning training at gym", time: "2022-01-01T09:30:00.000Z" },
    { label: "Gym personal training", time: "2022-01-01T09:30:00.000Z" },
    { label: "Shoulder & back gym training", time: "2022-01-01T09:30:00.000Z" },
    { label: "Decline press exercise", time: "2022-01-01T09:30:00.000Z" },
];

export default function Appointment(props) {


    return (
        <SafeAreaView style={styles.container}>
            <Header title="Appointments" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                {appointments.map((appointment, index) => {
                    return (
                        <View style={styles.appointment} key={index}>
                            <Text style={styles.appointmentLabel}>{appointment.label}</Text>
                            <Text style={styles.appointmentTime}>{moment(appointment.time).format("hh:mm a")}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                <TouchableOpacity style={styles.zoomButton}>
                                    <Text style={styles.zoomButtonText}>Zoom</Text>
                                    <Image source={require("../assets/images/logo-zoom.png")} style={styles.zoomImage} resizeMode='contain' />
                                </TouchableOpacity>

                                <View style={{ width: 20 }} />

                                <TouchableOpacity style={styles.zoomButton}>
                                    <Text style={styles.zoomButtonText}>{moment(appointment.time).format("MMM DD, YYYY")}</Text>
                                    <MaterialCommunityIcons name="calendar-clock" size={20} color={color.black} />
                                </TouchableOpacity>
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
    appointment: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#CCC'
    },
    appointmentLabel: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
    },
    appointmentTime: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    zoomButton: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#EEEEEE",
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomButtonText: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
        marginRight: 10,
    },
    zoomImage: {
        width: 25,
        height: 25,
    }
};