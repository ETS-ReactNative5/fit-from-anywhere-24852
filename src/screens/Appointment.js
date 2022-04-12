import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    Linking,
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
import { HttpRequest, HttpResponse } from '../utils/http';
import Toast from '../components/Toast';
import NoData from '../components/NoData';
import LoadingIndicator from '../components/LoadingIndicator';
import ImageUtils from '../utils/ImageUtils';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

// const appointments = [
//     { label: "Practice online", time: "2022-01-01T09:30:00.000Z" },
//     { label: "Morning training at gym", time: "2022-01-01T09:30:00.000Z" },
//     { label: "Gym personal training", time: "2022-01-01T09:30:00.000Z" },
//     { label: "Shoulder & back gym training", time: "2022-01-01T09:30:00.000Z" },
//     { label: "Decline press exercise", time: "2022-01-01T09:30:00.000Z" },
// ];

export default function Appointment(props) {
    const profile = useSelector(state => state.profile);
    const [isLoading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);

    useFocusEffect(useCallback(() => {
        loadAppointments();
    }, []));

    const loadAppointments = useCallback(() => {
        setLoading(true);

        let promise = null;
        if (profile.is_trainer) {
            promise = HttpRequest.getAppointmentListForTrainer();
        } else {
            promise = HttpRequest.getAppointmentList();
        }

        promise.then((res) => {
            console.log("getAppointmentList", res.data.results);
            setAppointments(res.data.results);
            setLoading(false);
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load appointments data"));
            setLoading(false);
        });
    }, [profile]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Appointments"
                onLeftClick={() => {
                    props.navigation.openDrawer();
                }}
                rightIcon={<MaterialCommunityIcons name="plus" size={25} color={color.white} />}
                onRightClick={() => {
                    props.navigation.navigate("AppointmentEdit");
                }}
            />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadAppointments}
                    />
                }>
                {isLoading && <LoadingIndicator />}

                {!isLoading && (
                    <>
                        {appointments.length == 0 && <NoData>No Appointment Available</NoData>}
                        {appointments.map((appointment, index) => {
                            return (
                                <TouchableOpacity style={styles.appointment} key={index} onPress={() => {
                                    if (profile.is_trainer) {
                                        props.navigation.navigate("AppointmentView", { appointment });
                                    } else {
                                        props.navigation.navigate("AppointmentEdit", { appointment });
                                    }
                                }}>
                                    {!profile.is_trainer && (
                                        <Text style={styles.appointmentLabel}>
                                            {appointment.apointment_type == null && "Appointment with " + appointment.trainer?.name}
                                            {appointment.apointment_type == "appointment" && "Appointment with " + appointment.trainer?.name}
                                            {appointment.apointment_type == "training" && "Training with " + appointment.trainer?.name}
                                        </Text>
                                    )}
                                    {profile.is_trainer && (
                                        <Text style={styles.appointmentLabel}>
                                            {appointment.apointment_type == null && "Appointment with " + appointment.user?.name}
                                            {appointment.apointment_type == "appointment" && "Appointment with " + appointment.user?.name}
                                            {appointment.apointment_type == "training" && "Training with " + appointment.user?.name}
                                        </Text>
                                    )}
                                    <Text style={styles.appointmentTime}>{moment(appointment.created_at).format("hh:mm a")}</Text>

                                    <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                        {(appointment.status == null || appointment.status == "pending") && (
                                            <View style={styles.badgeWarning}>
                                                <Text style={styles.badgeWarningText}>Requires Trainer Approval</Text>
                                            </View>
                                        )}
                                        {appointment.status == "approved" && (
                                            <View style={styles.badgeSuccess}>
                                                <Text style={styles.badgeSuccessText}>Approved by Trainer</Text>
                                            </View>
                                        )}
                                        {appointment.status == "rejected" && (
                                            <View style={styles.badgeDanger}>
                                                <Text style={styles.badgeDangerText}>Rejected by Trainer</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                        {(appointment.zoom_link != null && appointment.zoom_link != "") && (
                                            <TouchableOpacity style={styles.zoomButton} onPress={() => {
                                                Linking.canOpenURL(appointment.zoom_link).then(() => {
                                                    Linking.openURL(appointment.zoom_link);
                                                }).catch((err) => {
                                                    Toast.showError("Your link is not valid");
                                                });
                                            }}>
                                                <Text style={styles.zoomButtonText}>Zoom</Text>
                                                <Image source={ImageUtils.logoZoom} style={styles.zoomImage} resizeMode='contain' />
                                            </TouchableOpacity>
                                        )}

                                        {(appointment.zoom_link == null || appointment.zoom_link == "") && (
                                            <View style={styles.zoomButton}>
                                                <Text style={styles.zoomButtonTextNa}>Zoom Link Not Available</Text>
                                            </View>
                                        )}

                                        <View style={{ width: 20 }} />

                                        <View style={styles.zoomButton}>
                                            <Text style={styles.zoomButtonText}>{moment(appointment.booked_date + " " + appointment.booked_time).format("MMM DD, YYYY")}</Text>
                                            <MaterialCommunityIcons name="calendar-clock" size={20} color={color.black} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
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
    zoomButtonTextNa: {
        fontSize: 13,
        fontFamily: font.sourceSansPro,
        color: color.text,
        textAlign: 'center',
    },
    zoomImage: {
        width: 25,
        height: 25,
    },

    badgeWarning: {
        backgroundColor: color.warning,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 5,
    },
    badgeWarningText: {
        color: color.black,
        fontSize: 12,
    },
    badgeSuccess: {
        backgroundColor: color.success,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 5,
    },
    badgeSuccessText: {
        color: color.white,
        fontSize: 12,
    },
    badgeDanger: {
        backgroundColor: color.danger,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 5,
    },
    badgeDangerText: {
        color: color.white,
        fontSize: 12,
    },
};