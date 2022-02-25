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
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import Combobox from '../components/Combobox';
import { HttpRequest, HttpResponse } from '../utils/http';
import { useSelector } from 'react-redux';
import Toast from '../components/Toast';

const appointmentTypes = [
    { id: "appointment", label: "Appointment" },
    { id: "training", label: "Training" },
];

export default function AppointmentEdit(props) {
    const profile = useSelector(state => state.profile);
    const appointment = props.route.params?.appointment;

    const [zoom_link, setZoomLink] = useState("");
    const [booked_date, setBookedDate] = useState(moment().format("YYYY-MM-DD"));
    const [booked_time, setBookedTime] = useState(moment().format("HH:mm"));
    const [apointment_type, setApointmentType] = useState("appointment");
    const [status, setStatus] = useState("pending");
    const [trainer, setTrainer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        setZoomLink(appointment.zoom_link);
        setBookedDate(appointment.booked_date);
        setBookedTime(appointment.booked_time);
        setApointmentType(appointment.apointment_type);
        setStatus(appointment.status);
        setTrainer(appointment.trainer.id);
    }, [appointment]);

    useEffect(() => {
        loadTrainers();
    }, []);

    const loadTrainers = useCallback(() => {
        HttpRequest.getUserProfileList().then((res) => {
            console.log("loadTrainers", res.data.results);
            let _trainers = [];
            let rawTrainers = res.data.results;
            rawTrainers.forEach((trn) => {
                if (trn.is_trainer) {
                    _trainers.push({
                        id: trn.user.id,
                        label: trn.user.name,
                    });
                }
            });
            if (trainer) {
                setTrainer(_trainers[0].id);
            }
            setTrainers(_trainers);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load trainer list"));
        });
    }, [trainer]);

    const saveAppointment = useCallback(() => {
        setIsLoading(true);

        let data = {
            zoom_link,
            booked_date,
            booked_time,
            apointment_type,
            status,
            trainer,
            user: profile.user.id,
        };

        let promise = appointment ? HttpRequest.patchAppointment(appointment.id, data) : HttpRequest.saveAppointment(data);

        promise.then((res) => {
            Toast.showSuccess("Appointment saved successfully");
            // props.navigation.goBack();
            setIsLoading(false);
        }).catch((err) => {
            console.log("Err", err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot save appointment"));
            setIsLoading(false);
        });

    }, [appointment, profile, zoom_link, booked_date, booked_time, apointment_type, status, trainer]);

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
                    <DatePicker
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
                        displayFormat='HH:mm'
                        value={booked_time}
                        onChange={(val) => {
                            setBookedTime(val);
                        }} />

                    <Combobox
                        label="Type"
                        style={styles.combo}
                        selectedValue={apointment_type}
                        data={appointmentTypes}
                        onValueChange={(val, itemIndex) => {
                            setApointmentType(val);
                        }}
                    />

                    <Combobox
                        label="Trainer"
                        style={styles.combo}
                        selectedValue={trainer}
                        data={trainers}
                        onValueChange={(val, itemIndex) => {
                            setTrainer(val);
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
    }
};