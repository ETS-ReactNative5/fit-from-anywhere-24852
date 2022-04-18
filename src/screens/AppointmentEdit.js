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
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import Combobox from '../components/Combobox';
import { HttpRequest, HttpResponse } from '../utils/http';
import { useSelector } from 'react-redux';
import Toast from '../components/Toast';
import { usePubNub } from 'pubnub-react';
import PushNotificationUtils from '../utils/PushNotificationUtils';

const appointmentTypes = [
    { id: "appointment", label: "Appointment" },
    { id: "training", label: "Training" },
];

export default function AppointmentEdit(props) {
    const pubnub = usePubNub();
    const profile = useSelector(state => state.profile);
    const appointment = props.route.params?.appointment;

    const [zoom_link, setZoomLink] = useState("");
    const [dateTime, setDateTime] = useState(null);
    const [apointment_type, setApointmentType] = useState("appointment");
    const [status, setStatus] = useState("pending");
    const [trainer, setTrainer] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [trainers, setTrainers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (profile.is_trainer) {
            setTrainer(profile.user.id);
            setStatus("approved");
        } else {
            setUser(profile.user.id);
        }
    }, [profile]);

    useEffect(() => {
        if (appointment) {
            setZoomLink(appointment?.zoom_link);
            if (appointment.booked_date != null && appointment.booked_time != null) {
                setDateTime(appointment.booked_date + " " + appointment.booked_time);
            }
            setApointmentType(appointment?.apointment_type);
            setStatus(appointment?.status);
            setTrainer(appointment?.trainer.id);
        }
    }, [appointment]);

    useEffect(() => {
        loadTrainers();
    }, []);

    const loadTrainers = useCallback(() => {
        HttpRequest.getUserProfileList().then((res) => {
            console.log("loadTrainers", res.data.results);
            let _trainers = [];
            let _users = [];
            let rawTrainers = res.data.results;
            rawTrainers.forEach((trn) => {
                if (trn.is_trainer) {
                    _trainers.push({
                        id: trn.user.id,
                        label: trn.user.name,
                    });
                } else {
                    _users.push({
                        id: trn.user.id,
                        label: trn.user.name,
                    });
                }
            });
            if (trainer) {
                setTrainer(_trainers[0].id);
            }
            setTrainers(_trainers);

            if (user) {
                setUser(_users[0].id);
            }
            setUsers(_users);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load trainer & user list"));
        });
    }, [trainer, user]);

    const saveAppointment = useCallback(() => {
        if (user == null) {
            Toast.showError("Please select user");
            return;
        }

        if (trainer == null) {
            Toast.showError("Please select trainer");
            return;
        }

        if (dateTime == null) {
            Toast.showError("Please select date & time");
            return;
        }

        setIsLoading(true);

        let data = {
            zoom_link,
            booked_date: moment(dateTime).format("YYYY-MM-DD"),
            booked_time: moment(dateTime).format("HH:mm"),
            apointment_type,
            status,
            trainer,
            user,
        };

        let promise = appointment ? HttpRequest.patchAppointment(appointment.id, data) : HttpRequest.saveAppointment(data);

        promise.then((res) => {
            Toast.showSuccess("Appointment saved successfully");

            //only send notification when create new appointment
            if (appointment == null) {
                if (profile.is_trainer) {
                    PushNotificationUtils.sendChatNotification(pubnub, user, "New Appointment", "You have a new appointment from " + profile.user.name);
                } else {
                    PushNotificationUtils.sendChatNotification(pubnub, trainer, "New Appointment", "You have a new appointment from " + profile.user.name);
                }
            }

            props.navigation.goBack();
            setIsLoading(false);
        }).catch((err) => {
            console.log("Err", err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot save appointment"));
            setIsLoading(false);
        });

    }, [appointment, zoom_link, dateTime, apointment_type, status, trainer, user, profile, pubnub]);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={appointment ? "Edit Appointment" : "New Appointment"}
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }} />
            <ScrollView>
                <View style={styles.content}>
                    {profile.is_trainer == false && (
                        <>

                            <Combobox
                                label="Trainer"
                                placeholder="Select trainer"
                                style={styles.combo}
                                selectedValue={trainer}
                                data={trainers}
                                onValueChange={(val, itemIndex) => {
                                    setTrainer(val);
                                }}
                            />

                            {trainer != null && (
                                <>
                                    <Text style={styles.chooserLabel}>Choose Time</Text>
                                    <TouchableOpacity style={styles.chooser} onPress={() => {
                                        props.navigation.navigate("AppointmentSlot", {
                                            trainer: trainer,
                                            onSelect: (dateTime) => {
                                                console.log("onSelect", dateTime);
                                                setDateTime(dateTime);
                                            },
                                        });
                                    }}>
                                        {/* <Text style={styles.chooserText}>{dateTime}</Text> */}
                                        {dateTime != null && <Text style={styles.chooserText}>{moment(dateTime).format("MMM DD, YYYY, hh:mm a")}</Text>}
                                        {dateTime == null && <Text style={styles.chooserText}>Select time slot</Text>}
                                    </TouchableOpacity>

                                </>
                            )}

                            {trainer == null && (
                                <View style={{ opacity: 0.5 }}>
                                    <Text style={styles.chooserLabel}>Choose Time</Text>
                                    <View style={styles.chooser}>
                                        <Text style={styles.chooserText}>Please select trainer first</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {profile.is_trainer == true && (
                        <>

                            <Combobox
                                label="User"
                                placeholder="Select user"
                                style={styles.combo}
                                selectedValue={user}
                                data={users}
                                onValueChange={(val, itemIndex) => {
                                    setUser(val);
                                }}
                            />

                            {user != null && (
                                <>
                                    <Text style={styles.chooserLabel}>Choose Time</Text>
                                    <TouchableOpacity style={styles.chooser} onPress={() => {
                                        props.navigation.navigate("AppointmentSlot", {
                                            trainer: trainer,
                                            onSelect: (dateTime) => {
                                                console.log("onSelect", dateTime);
                                                setDateTime(dateTime);
                                            },
                                        });
                                    }}>
                                        {/* <Text style={styles.chooserText}>{dateTime}</Text> */}
                                        {dateTime != null && <Text style={styles.chooserText}>{moment(dateTime).format("MMM DD, YYYY, hh:mm a")}</Text>}
                                        {dateTime == null && <Text style={styles.chooserText}>Select time slot</Text>}
                                    </TouchableOpacity>

                                </>
                            )}

                            {user == null && (
                                <View style={{ opacity: 0.5 }}>
                                    <Text style={styles.chooserLabel}>Choose Time</Text>
                                    <View style={styles.chooser}>
                                        <Text style={styles.chooserText}>Please select user first</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {/* <DatePicker
                        label='Booking Date'
                        style={styles.input}
                        // style={{ borderWidth: 0, padding: 0, borderBottomWidth: 0, height: 30, paddingVertical: 0 }}
                        // containerStyle={{ width: 130, padding: 0 }}
                        format='YYYY-MM-DD'
                        displayFormat='MMM DD, YYYY'
                        value={booked_date}
                        onChange={(val) => {
                            setBookedDate(val);
                        }} />

                    <DatePicker
                        label='Booking Time'
                        style={styles.input}
                        // style={{ borderWidth: 0, padding: 0, borderBottomWidth: 0, height: 30, paddingVertical: 0 }}
                        // containerStyle={{ width: 130, padding: 0 }}
                        format='HH:mm'
                        mode='time'
                        displayFormat='HH:mm'
                        value={booked_time}
                        onChange={(val) => {
                            setBookedTime(val);
                        }} /> */}

                    <Combobox
                        label="Type"
                        style={styles.combo}
                        selectedValue={apointment_type}
                        data={appointmentTypes}
                        onValueChange={(val, itemIndex) => {
                            setApointmentType(val);
                        }}
                    />



                    <TextInput
                        label='Zoom Link'
                        icon={<MaterialCommunityIcons name='email-outline' size={20} color={color.gray} />}
                        placeholder="Enter zoom link"
                        value={zoom_link}
                        onChangeText={setZoomLink}
                        containerStyle={styles.input} />

                    <View style={{ height: 20 }} />

                    <Button loading={isLoading} onPress={() => {
                        saveAppointment();
                    }}>Save</Button>
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
        padding: 20,
    },
    input: {
        marginBottom: 20,
    },
    combo: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: color.primary,
        borderRadius: 10,
        paddingHorizontal: 15,
    },

    chooserLabel: {
        marginBottom: 5,
    },
    chooser: {
        borderWidth: 1,
        paddingHorizontal: 15,
        height: 50,
        borderColor: color.primary,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    chooserText: {
        fontSize: 14,
        color: color.black,
    },
};