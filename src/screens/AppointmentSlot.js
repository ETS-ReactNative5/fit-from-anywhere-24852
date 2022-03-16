import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
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
import CalendarStrip from 'react-native-calendar-strip';
import { HttpRequest, HttpResponse } from '../utils/http';
import { useSelector } from 'react-redux';
import Toast from '../components/Toast';
import LoadingIndicator from '../components/LoadingIndicator';

let hours = [];
for (let i = 0; i <= 23; i++) {
    hours.push(i);
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AppointmentSlot(props) {
    const trainerId = props.route.params?.trainer;
    const onSelect = props.route.params?.onSelect;
    // console.log("Trainer", trainerId);

    const scrollViewRef = useRef();

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDay, setIsLoadingDay] = useState(false);
    const [markedDates, setMarkedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [dailyBookings, setDailyBookings] = useState([]);
    const [selectedHour, setSelectedHour] = useState(null);

    const convertTimeToMinute = useCallback((time) => {
        return Math.floor(moment(time, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') / 60)
    }, []);

    const convertMinuteToTime = useCallback((minute) => {
        return moment.utc(minute * 60 * 1000).format('HH:mm:ss');
    }, []);

    const convertToHour = useCallback((hour) => {
        if (hour < 10) {
            return `0${hour}:00`;
        } else {
            return `${hour}:00`;
        }
    }, []);

    const filterDay = useCallback((date) => {
        if (date == null) {
            date = selectedDate.format("YYYY-MM-DD")
        }

        setIsLoadingDay(true);
        setSelectedHour(null);
        setDailyBookings([]);

        HttpRequest.getAppointmentByDate(date, trainerId).then((res) => {
            let dailyBookings = res.data.results;
            console.log("filterDay", dailyBookings);

            setIsLoadingDay(false);
            setDailyBookings(dailyBookings);

            setTimeout(() => {
                scrollViewRef.current.scrollTo({
                    y: startTime
                });
            }, 400);
        }).catch((err) => {
            console.log(err.response)
            setIsLoadingDay(false);
        })
    }, [trainerId, selectedDate, scrollViewRef, startTime]);

    useEffect(() => {
        setStartTime(convertTimeToMinute("09:00:00"));
        setEndTime(convertTimeToMinute("18:00:00"));
        filterDay();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Choose Time"
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }} />
            {isLoading && <LoadingIndicator />}

            {!isLoading && (
                <>
                    <CalendarStrip
                        scrollable
                        calendarAnimation={{ type: 'sequence', duration: 30 }}
                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 0, borderHighlightColor: 'white' }}
                        style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                        // calendarHeaderStyle={{ color: 'white' }}
                        calendarColor={'#eee'}
                        dateNumberStyle={{ color: color.black }}
                        dateNameStyle={{ color: color.black }}
                        highlightDateNumberStyle={{ color: color.primary }}
                        highlightDateNameStyle={{ color: color.primary }}
                        // disabledDateNameStyle={{ color: 'grey' }}
                        // disabledDateNumberStyle={{ color: 'grey' }}
                        // datesWhitelist={datesWhitelist}
                        iconContainer={{ flex: 0.1 }}
                        selectedDate={selectedDate}
                        onDateSelected={(date) => {
                            let selectedDate = date;
                            console.log("Date", selectedDate);
                            setSelectedDate(selectedDate);
                            filterDay(moment(selectedDate).format("YYYY-MM-DD"));
                        }}
                        markedDates={markedDates}
                    />

                    {selectedDate != null && (
                        <ScrollView ref={scrollViewRef}>
                            {isLoadingDay && <LoadingIndicator />}

                            {!isLoadingDay && (
                                <>
                                    {startTime != 0 && (
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 70,
                                            width: SCREEN_WIDTH - 70,
                                            backgroundColor: color.danger,
                                            height: startTime + 60,
                                        }} />
                                    )}

                                    {endTime != 0 && (
                                        <View style={{
                                            position: 'absolute',
                                            top: endTime + 60,
                                            left: 70,
                                            width: SCREEN_WIDTH - 70,
                                            backgroundColor: color.danger,
                                            height: 24 * 60 - endTime - 60,
                                        }} />
                                    )}

                                    <View style={styles.hourContainer}>
                                        <View style={styles.hourTextWrap}>

                                        </View>
                                    </View>
                                    {hours.map((hour) => {
                                        let selected = false;
                                        if (hour == selectedHour) {
                                            selected = true;
                                        }

                                        return (
                                            <View key={hour} style={styles.hourContainer}>
                                                <View style={styles.hourTextWrap}>
                                                    <Text style={styles.hourText}>{convertToHour(hour)}</Text>
                                                </View>
                                                <View style={styles.hourContent}>
                                                    {(hour >= Math.floor(startTime / 60)
                                                        && hour < Math.floor(endTime / 60)) && (
                                                            <TouchableOpacity style={[styles.hourContentItem, selected ? { backgroundColor: color.success } : {}]}
                                                                onPress={() => {
                                                                    setSelectedHour(hour);
                                                                }}>
                                                                {selected && (<Text style={[styles.hourContentItemText, { color: color.primary }]}>Selected ({convertToHour(hour)})</Text>)}
                                                                {!selected && (<Text style={styles.hourContentItemText}>Available</Text>)}
                                                            </TouchableOpacity>
                                                        )}
                                                </View>
                                            </View>
                                        );
                                    })}

                                    {dailyBookings.map((item, index) => {
                                        let start = convertTimeToMinute(moment(item.date_and_time).format("HH:mm:ss"));
                                        let minute = 60;

                                        if (item.service.estimated_time != null) {
                                            minute = convertTimeToMinute(item.service.estimated_time);
                                        }

                                        return (
                                            <View key={index} style={[styles.bookingSlot, {
                                                width: SCREEN_WIDTH - 75,
                                                top: start + 60,
                                                height: minute,
                                            }]}>
                                                <Text style={styles.bookingSlotTitle}>Not Available</Text>
                                            </View>
                                        );
                                    })}
                                </>
                            )}
                        </ScrollView>
                    )}
                </>
            )}

            {selectedHour != null && (
                <View style={styles.bottomContainer}>
                    <Button onPress={() => {
                        let strDate = moment(selectedDate).format("YYYY-MM-DD");
                        let strTime = convertToHour(selectedHour);
                        console.log({ strDate, strTime });
                        props.navigation.goBack();
                        onSelect(strDate + " " + strTime + ":00");
                    }}>
                        Select Time
                    </Button>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    hourContainer: {
        height: 60,
        borderBottomColor: color.border,
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    hourTextWrap: {
        width: 70,
        alignItems: 'flex-end',
        backgroundColor: color.white,
        paddingRight: 10,
        transform: [
            { translateY: -13 }
        ]
    },
    hourContent: {
        flex: 1,
        padding: 3,
    },
    hourText: {
        fontSize: 14,
        fontFamily: fonts.workSansMedium,
    },
    hourContentItem: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    hourContentItemText: {
        color: '#2c3e50',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
};