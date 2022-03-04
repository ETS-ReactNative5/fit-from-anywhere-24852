import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import NoData from '../components/NoData';
import Toast from '../components/Toast';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import { useSelector } from 'react-redux';
import Combobox from '../components/Combobox';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { usePubNub } from 'pubnub-react';
import LoadingIndicator from '../components/LoadingIndicator';

export default function MessageCreateDirect(props) {
    const profile = useSelector((state) => state.profile);
    const pubnub = usePubNub();

    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [allMembers, setAllMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        loadProfiles();
    }, [profile]);

    const loadProfiles = useCallback(() => {
        setLoading(true);
        HttpRequest.getUserProfileList().then((res) => {
            console.log("getUserProfileList", res.data);
            let _allMembers = [];
            res.data.results.forEach((item) => {
                if (item.user.id != profile.user.id) {
                    _allMembers.push({
                        id: item.user.id + "",
                        label: item.user.name,
                        image: HttpUtils.normalizeUrl(item.profile_image),
                    });
                }
            });
            setAllMembers(_allMembers);
            setLoading(false);
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load profile data"));
            setLoading(false);
        });
    }, [profile]);

    const createDirect = useCallback(() => {
        if (selectedMember.length == 0) {
            Toast.showError("Please select members");
            return;
        }

        setSaving(true);

        const channelName = "private." + profile.user.id + "-" + selectedMember.id;

        pubnub.objects.setChannelMetadata({
            channel: channelName,
            data: {
                name: "[DIRECT]",
                description: "N/A",
                custom: {
                    image,
                    member_1: profile.user.id + "", 
                    member_2: selectedMember.id + "",
                },
            },
            include: {
                customFields: true,
            },
        }).then((res) => {
            console.log("setChannelMetadata", res);

            if (res.status == 200) {
                pubnub.objects.setChannelMembers({
                    channel: channelName,
                    uuids: [profile.user.id + "", selectedMember.id + ""],
                }).then((res2) => {
                    console.log("setChannelMembers", res2);
                    if (res2.status == 200) {

                        setSaving(false);
                        props.navigation.goBack();
                    } else {
                        Toast.showError("Cannot set channel member, please try again");
                        setSaving(false);
                    }
                }).catch((err) => {
                    console.log("setChannelMembers:error", err.status);
                    Toast.showError("Cannot set channel member, please try again");
                    setSaving(false);
                })
            } else {
                Toast.showError("Cannot create channel, please try again");
                setSaving(false);
            }
        }).catch((err) => {
            console.log("setChannelMetadata:error", err.status);
            Toast.showError("Cannot create channel, please try again");
            setSaving(false);
        });
    }, [profile, selectedMember]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title='New Message'
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }}
                rightIcon={isSaving ? <ActivityIndicator color={color.white} /> : <MaterialCommunityIcons name='content-save' size={25} color={color.white} />}
                onRightClick={() => {
                    createDirect();
                }}
            />
            <ScrollView>
                <View style={styles.content}>
                    {isLoading && <LoadingIndicator />}

                    {!isLoading && (
                        <>
                            {allMembers.length == 0 && <NoData>No Member Available</NoData>}
                            {allMembers.map((member, index) => {
                                let isSelected = false;
                                if (selectedMember) {
                                    if (selectedMember.id == member.id) {
                                        isSelected = true;
                                    }
                                }
                                return (
                                    <TouchableOpacity style={isSelected ? styles.listSelected : styles.list} key={index} onPress={() => {
                                        setSelectedMember(member);
                                    }}>
                                        {member.image == null && <Image source={require('../assets/images/no-image.png')} style={styles.image} resizeMode='cover' />}
                                        {member.image != null && <Image source={{ uri: member.image }} style={styles.image} resizeMode='cover' />}
                                        <Text style={styles.name}>{member.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </>
                    )}
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
    card: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.gray,
        marginTop: 10,
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: color.gray,
        borderRadius: 10,
        padding: 10,
    },
    listSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color.primary,
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
    },
    title: {
        fontSize: 10,
        color: color.black + "70",
        fontWeight: '600',
        marginBottom: 7,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        // fontWeight: '600',
        fontSize: 16,
        color: color.black,
        marginLeft: 10,
    },
    desc: {
        fontWeight: '400',
        fontSize: 12,
        color: color.black,
    },

    addMember: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMemberText: {
        fontWeight: '400',
        fontSize: 12,
        color: color.black,
        marginLeft: 10,
    }
};