import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadImageView from '../components/UploadImageView';

const analytics = [
    { label: "Jump Squats" },
    { label: "Barbell Push Press" },
    { label: "Pull/ups" },
];

export default function Profile(props) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('Tim Castle');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('M');
    const [address, setAddress] = useState('Los Angeles, CA');

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Profile" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <ScrollView>
                <View style={styles.image}>
                    <UploadImageView
                        // label="Upload image"
                        value={image}
                        containerStyle={styles.input}
                        onSelectImage={(imagePath) => {
                            console.log("UploadImageView", imagePath);
                            setImage(imagePath);
                        }} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={color.gray}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                        }} />
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor={color.gray}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                        }} />
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Date of Birth"
                        placeholderTextColor={color.gray}
                        value={dob}
                        onChangeText={(text) => {
                            setDob(text);
                        }} />
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                    <Text style={styles.label}>Gender</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Gender"
                        placeholderTextColor={color.gray}
                        value={gender}
                        onChangeText={(text) => {
                            setGender(text);
                        }} />
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                    <Text style={styles.label}>Student Campus Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Gender"
                        placeholderTextColor={color.gray}
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text);
                        }} />
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                    <Text style={styles.sectionTitle}>Workout analytics chart</Text>
                </View>

                {analytics.map((item, index) => {
                    return (
                        <View style={[styles.section, index % 2 == 0 ? { backgroundColor: "rgba(229, 235, 238, 1)" } : null]} key={index}>
                            <View style={styles.sectionRow}>
                                <Text style={styles.sectionLabel}>{item.label}</Text>
                                <Text style={styles.sectionTime}>11 JAN - 15 JAN</Text>
                            </View>
                            <View style={styles.sectionValue}>
                                <MaterialCommunityIcons name='yoga' size={20} color={color.text} />
                                <Text style={styles.sectionQty}>7</Text>
                                <View style={styles.sectionSeparator} />
                                <MaterialCommunityIcons name='dumbbell' size={20} color={color.text} />
                                <Text style={styles.sectionQty}>14</Text>
                                <View style={styles.sectionSeparator} />
                                <MaterialCommunityIcons name='weight-lifter' size={20} color={color.text} />
                                <Text style={styles.sectionQty}>25 kg</Text>
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
    button: {
        backgroundColor: '#00FF00',
        padding: 10,
        marginTop: 10,
    },
    line: {
        height: 1,
        backgroundColor: color.gray,
    },
    image: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: font.sourceSansProBold,
        color: color.text,
    },
    input: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionValue: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        justifyContent: 'center',
    },
    sectionLabel: {
        fontSize: 18,
        fontFamily: font.sourceSansProBold,
        color: color.text,
        flex: 1,
    },
    sectionTime: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    sectionQty: {
        fontSize: 25,
        fontFamily: font.sourceSansPro,
        color: color.text,
        marginHorizontal: 10,
    },
    sectionSeparator: {
        height: 30,
        width: 1,
        backgroundColor: color.text,
        marginHorizontal: 10,
    },
};