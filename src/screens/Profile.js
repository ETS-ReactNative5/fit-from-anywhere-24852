import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import UploadImageView from '../components/UploadImageView';
import { FormDataConverter, HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import Toast from '../components/Toast';
import CustomTextInput from '../components/TextInput';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../store/actions';
import SimpleModal from '../components/SimpleModal';
import ImageUtils from '../utils/ImageUtils';
import GymUtils from '../utils/GymUtils';

const analytics = [
    { label: "Jump Squats" },
    { label: "Barbell Push Press" },
    { label: "Pull/ups" },
];

export default function Profile(props) {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const gym = useSelector(state => state.gym);
    const [image, setImage] = useState(null);
    const [name, setName] = useState('Tim Castle');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('M');
    const [address, setAddress] = useState('Los Angeles, CA');
    const [gymCode, setGymCode] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [isImageChange, setImageChange] = useState(false);
    const [gymCodeVisible, setGymCodeVisible] = useState(false);
    const [isSavingGymCode, setSavingGymCode] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = useCallback(() => {
        setLoading(true);

        HttpRequest.getProfile().then((res) => {
            console.log("getProfile", res.data);
            let _profile = res.data;

            setLoading(false);
            setName(_profile.user.name);
            setEmail(_profile.user.email);
            setDob(_profile.dob);
            setGender(_profile.gender);
            setImage(HttpUtils.normalizeUrl(_profile.profile_image));
            setAddress(_profile.student_campus_residential_address ?? "");
            setGymCode(_profile.trial_code ?? "");

            GymUtils.searchGymCode(_profile.trial_code ?? "", dispatch);

            dispatch(setProfile(_profile));
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load profile data"));
            setLoading(false);
        });
    }, []);

    const updateProfile = useCallback(() => {
        setSaving(true);
        let data = {
            user: {
                email,
                name,
            },
            dob,
            gender,
            student_campus_residential_address: address,
            // is_trainer: "true",
        };

        if (data.dob == '' || data.dob == null) {
            delete data.dob;
        }

        let useFormData = false;

        if (isImageChange) {
            data = FormDataConverter.convert(data);
            data.append('profile_image', {
                name: 'image-' + moment().format("YYYY-MM-DD-HH-mm-ss") + '.jpg',
                type: 'image/jpeg',
                uri: image,
            });
            useFormData = true;
        }

        console.log("Data", JSON.stringify(data));

        HttpRequest.patchUserProfile(data, useFormData).then((res) => {
            Toast.showSuccess("Profile updated successfully");
            setSaving(false);

            loadProfile();
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot update profile data"));
            setSaving(false);
        });
    }, [image, name, email, dob, gender, address, isImageChange]);

    const updateGymCode = useCallback(async () => {
        setSavingGymCode(true);

        if (gymCode != "") {
            let res = await HttpRequest.searchGymCode(gymCode);
            let result = res.data.results;
            if (result.length > 0) {
                let exist = false;
                result.forEach((item) => {
                    if (item.code == gymCode) {
                        exist = true;
                    }
                });
                if (exist == false) {
                    Alert.alert("Error", "Gym code not found");
                    setSavingGymCode(false);
                    return;
                }
            } else {
                Alert.alert("Error", "Gym code not found");
                setSavingGymCode(false);
                return;
            }
        }

        let data = {
            trial_code: gymCode,
        };

        HttpRequest.patchUserProfile(data, false).then((res) => {
            Toast.showSuccess("Gym code updated successfully");
            setSavingGymCode(false);
            setGymCodeVisible(false);

            loadProfile();

            props.navigation.navigate("ChooseProgram");
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot update gym code"));
            setSavingGymCode(false);
        });
    }, [gymCode, profile]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Profile"
                onLeftClick={() => {
                    props.navigation.openDrawer();
                }}
            />
            <ScrollView>
                <View style={styles.image}>
                    <UploadImageView
                        // label="Upload image"
                        value={image}
                        containerStyle={styles.input}
                        onSelectImage={(imagePath) => {
                            console.log("UploadImageView", imagePath);
                            setImage(imagePath);
                            setImageChange(true);
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

                {/* <View style={styles.line} />

                <View style={styles.row}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <DatePicker
                        style={{ borderWidth: 0, padding: 0, borderBottomWidth: 0, height: 30, paddingVertical: 0 }}
                        containerStyle={{ width: 130, padding: 0 }}
                        format='YYYY-MM-DD'
                        displayFormat='MMM DD, YYYY'
                        value={dob}
                        onChange={(dob) => {
                            setDob(dob);
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
                        placeholder="Address"
                        placeholderTextColor={color.gray}
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text);
                        }} />
                </View> */}

                <View style={styles.line} />

                <View style={{ padding: 20 }}>
                    <Button loading={isSaving}
                        onPress={() => { updateProfile() }}>Update Profile</Button>
                </View>

                <View style={styles.line} />

                <View style={{ padding: 20 }}>
                    {gym != null && (
                        <View style={styles.gym}>
                            {gym.gym_image == null && <Image source={ImageUtils.defaultImage} style={styles.gymImage} />}
                            {gym.gym_image != null && <Image source={{ uri: HttpUtils.normalizeUrl(gym.gym_image) }} style={styles.gymImage} />}
                            <View style={styles.gymInfo}>
                                <Text style={styles.gymName}>{gym.name}</Text>
                                <Text style={styles.gymText}>Gym Code: {gym.code}</Text>
                            </View>
                        </View>
                    )}

                    <Button
                        onPress={() => {
                            setGymCodeVisible(true);
                        }}>Click here to Update Gym Code</Button>
                </View>

                <View style={styles.line} />

                <View style={{ padding: 20 }}>
                    <Button
                        onPress={() => {
                            props.navigation.navigate("ChooseProgram");
                        }}>Click here to Choose Program</Button>
                </View>

                <SimpleModal
                    visible={gymCodeVisible}
                    onRequestClose={() => {
                        setGymCodeVisible(false);
                    }}>
                    <CustomTextInput
                        label='Gym Code'
                        style={styles.input}
                        placeholder="Enter your Gym Code"
                        placeholderTextColor={color.gray}
                        value={gymCode}
                        onChangeText={(text) => {
                            setGymCode(text);
                        }} />

                    <Button
                        loading={isSavingGymCode}
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            updateGymCode();
                        }}>Update Code</Button>
                </SimpleModal>

                {/* <View style={styles.line} />

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
                })} */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    gym: {
        flexDirection: "row",
        padding: 10,
        borderRadius: 10,
        backgroundColor: color.primary + "22",
        marginBottom: 20,
    },
    gymImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    gymInfo: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
    },
    gymName: {
        fontSize: 18,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
    },
    gymCode: {
        fontSize: 13,
        fontFamily: font.sourceSansPro,
        color: color.black,
    },

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