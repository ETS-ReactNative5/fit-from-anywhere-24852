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
import { Calendar } from 'react-native-calendars';

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


    return (
        <SafeAreaView style={styles.container}>
            <Header title="Dashboard" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <View style={styles.profile}>
                    <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
                    <View style={styles.profileContent}>
                        <Text style={styles.profileName}>Tim Castle</Text>
                        <View style={styles.profileInfo}>
                            <MaterialCommunityIcons name="map-marker" size={15} color={color.text} />
                            <Text style={styles.profileLocation}>Los Angeles, CA</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.line} />

                <TouchableOpacity style={styles.itemContent} activeOpacity={0.8} onPress={() => {

                }}>
                    <Text style={styles.itemText}>Request an Online appointment</Text>

                    <MaterialCommunityIcons name='calendar-range-outline' size={20} color={color.text} />
                </TouchableOpacity>

                <View style={styles.line} />

                <TouchableOpacity style={styles.itemContent} activeOpacity={0.8} onPress={() => {

                }}>
                    <Text style={styles.itemText}>Message a Trainer</Text>

                    <MaterialCommunityIcons name='message-text-outline' size={20} color={color.text} />
                </TouchableOpacity>

                <View style={styles.line} />

                <View style={styles.calendar}>
                    <Calendar
                        current={moment().format('YYYY-MM-DD')}
                        //markedDates={markedDates}
                        onDayPress={(day) => {

                        }}

                        enableSwipeMonths={true}
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
        paddingHorizontal: 20,
        paddingVertical: 20,
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