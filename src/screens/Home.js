import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { HttpUtils } from '../utils/http';
import Button from '../components/Button';

const promotions = [
    {
        label: "Freedom Yoga",
        description: "Village resort - Virtual",
        image: require('../assets/images/home-1.jpg'),
    },
    {
        label: "Gym Workout",
        description: "New gym resort - Live",
        image: require('../assets/images/home-2.jpg'),
    },
    {
        label: "Freedom Yoga",
        description: "Village resort - Virtual",
        image: require('../assets/images/home-1.jpg'),
    },
    {
        label: "Gym Workout",
        description: "New gym resort - Live",
        image: require('../assets/images/home-2.jpg'),
    },
];

export default function Home(props) {
    const profile = useSelector(state => state.profile);
    const [focusedDate, setFocusedDate] = useState(moment());
    const scrollRef = useRef();
    const calendarRef = useRef();

    const profileImage = useMemo(() => {
        return profile?.profile_image ? { uri: HttpUtils.normalizeUrl(profile.profile_image) } : require("../assets/images/profile.png");
    }, [profile]);

    const months = useMemo(() => {
        let months = [];
        for (let i = 0; i < 12; i++) {
            let monthMoment = moment().add(i, 'month');
            months.push({
                monthMoment,
                isFocused: monthMoment.isSame(focusedDate, 'month'),
            });
        }
        return months;
    }, [focusedDate]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Dashboard" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <View style={styles.profile}>
                    <Image source={profileImage} style={styles.profileImage} />
                    <View style={styles.profileContent}>
                        <Text style={styles.profileName}>{profile?.user?.name}</Text>
                        <View style={styles.profileInfo}>
                            <MaterialCommunityIcons name="map-marker" size={15} color={color.text} />
                            <Text style={styles.profileLocation}>{profile?.student_campus_residential_address}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.line} />

                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <Button style={{ flex: 1, height: 40 }} onPress={() => { props.navigation.navigate("Appointment") }}>Make Appointment</Button>
                    <View style={{ width: 20 }} />
                    <Button style={{ flex: 1, height: 40 }} onPress={() => { props.navigation.navigate("Message") }}>Message Trainer</Button>
                </View>

                <View style={styles.line} />

                <View style={styles.calendar}>
                    <View style={styles.calendarHeader}>
                        <ScrollView ref={scrollRef} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ width: 20 }} />
                            {months.map((month, index) => {
                                let focusedMonth = month.monthMoment.isSame(focusedDate, 'month');
                                return (
                                    <TouchableOpacity key={index} style={styles.monthButton} onPress={() => {
                                        // let date = month.monthMoment.format("YYYY-MM-DD");
                                        //scrollRef.current.scrollTo({ x: 100 * index + 20, animated: true });
                                        calendarRef.current.setSelectedDate(month.monthMoment);
                                    }}>
                                        <Text style={[styles.monthButtonText, focusedMonth ? { color: color.primary } : {}]}>{month.monthMoment.format("MMMM")}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    <CalendarStrip
                        ref={calendarRef}
                        scrollable
                        // style={{ height: 100 }}
                        upperCaseDays={false}
                        showMonth={false}
                        calendarColor={color.white}
                        calendarHeaderStyle={{ color: color.primary }}
                        // dayContainerStyle={{ backgroundColor: 'blue', overflow: 'visible' }}
                        // dateContainerStyle={{ backgroundColor: 'blue',  }}
                        dateNumberStyle={{ color: color.primary, marginTop: 10, fontSize: 16 }}
                        highlightDateNumberStyle={{ color: color.primary, marginTop: 10, fontSize: 16 }}
                        dateNameStyle={{ color: color.primary, fontSize: 12 }}
                        highlightDateNameStyle={{ color: color.primary, fontSize: 12 }}
                        // iconContainer={{ flex: 0.1 }}
                        onWeekChanged={(start, end) => {
                            //console.log(start, end);
                            setFocusedDate(start);
                            //get month difference with today
                            let firstDate = moment().date(1)
                            let difference = start.diff(firstDate, 'month');
                            console.log("Difference: ", difference);
                            scrollRef.current.scrollTo({ x: 100 * difference, animated: true });
                        }}
                    />
                </View>

                <View style={styles.line} />

                <View style={styles.promo}>
                    <Text style={styles.promoTitle}>Promo</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ width: 20 }} />
                        {promotions.map((item, index) => {
                            return (
                                <View style={styles.promoItem} key={index}>
                                    <Image source={item.image} style={styles.promoImage} />
                                    <Text style={styles.promoLabel}>{item.label}</Text>
                                    <Text style={styles.promoDescription}>{item.description}</Text>
                                </View>
                            );
                        })}
                        <View style={{ width: 10 }} />
                    </ScrollView>
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
    button: {
        backgroundColor: '#00FF00',
        padding: 10,
        marginTop: 10,
    },
    line: {
        height: 1,
        backgroundColor: color.gray,
    },
    profile: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    profileImage: {
        width: 63,
        height: 63,
        borderRadius: 10,
    },
    profileContent: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15,
    },
    profileName: {
        fontSize: 20,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileLocation: {
        fontSize: 12,
        fontFamily: font.sourceSansPro,
        color: color.text,
        marginLeft: 5,
    },
    itemContent: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    calendar: {
        // paddingHorizontal: 20,
        paddingVertical: 20,
    },
    calendarHeader: {
        height: 30,
        // backgroundColor: 'blue',
    },
    monthButton: {
        width: 100,
    },
    monthButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.gray,
    },
    promo: {
        paddingVertical: 20,
    },
    promoTitle: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
        marginLeft: 20,
        marginBottom: 10,
    },
    promoItem: {
        width: 150,
        marginRight: 10,
    },
    promoImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    promoLabel: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.text,
    },
    promoDescription: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    }
};