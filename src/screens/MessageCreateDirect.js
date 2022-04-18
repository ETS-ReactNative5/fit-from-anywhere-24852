import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import { font } from '../utils/font';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import NoData from '../components/NoData';
import Toast from '../components/Toast';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import { useSelector } from 'react-redux';
import { usePubNub } from 'pubnub-react';
import LoadingIndicator from '../components/LoadingIndicator';
import ImageUtils from '../utils/ImageUtils';
import TextInput from '../components/TextInput';

export default function MessageCreateDirect(props) {
    const profile = useSelector((state) => state.profile);
    const pubnub = usePubNub();

    const [allMembers, setAllMembers] = useState([]);
    const [filteredAllMembers, setFilteredAllMembers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadProfiles();
    }, [profile]);

    const loadProfiles = useCallback(() => {
        setLoading(true);
        setSearch("");
        HttpRequest.getUserProfileList().then((res) => {
            console.log("getUserProfileList", res.data);
            let _allMembers = [];
            if (profile.is_trainer) {
                res.data.results.forEach((item) => {
                    if (item.user.id != profile.user.id && !item.is_trainer) {
                        _allMembers.push({
                            id: item.user.id + "",
                            label: item.user.name,
                            image: HttpUtils.normalizeUrl(item.profile_image),
                        });
                    }
                });
            } else {
                res.data.results.forEach((item) => {
                    if (item.user.id != profile.user.id && item.is_trainer) {
                        _allMembers.push({
                            id: item.user.id + "",
                            label: item.user.name,
                            image: HttpUtils.normalizeUrl(item.profile_image),
                        });
                    }
                });
            }
            console.log("Members", _allMembers);
            setAllMembers(_allMembers);
            setFilteredAllMembers(_allMembers);
            setLoading(false);
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load profile data"));
            setLoading(false);
        });
    }, [profile]);

    const createDirect = useCallback((selectedMember) => {
        setSaving(true);

        const channelName = "private." + profile.user.id + "-" + selectedMember.id;

        pubnub.objects.setChannelMetadata({
            channel: channelName,
            data: {
                name: "[DIRECT]",
                description: "N/A",
                custom: {
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
    }, [profile]);

    const searchName = useCallback((text) => {
        setSearch(text);

        let filtered = [];
        allMembers.forEach((item) => {
            if (item.label.toLowerCase().includes(text.toLowerCase())) {
                filtered.push(item);
            }
        });

        setFilteredAllMembers(filtered);
    }, [allMembers]);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Header title='New Message'
                    leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                    onLeftClick={() => {
                        props.navigation.goBack();
                    }}
                // rightIcon={isSaving ? <ActivityIndicator color={color.white} /> : <MaterialCommunityIcons name='content-save' size={25} color={color.white} />}
                // onRightClick={() => {
                //     createDirect();
                // }}
                />

                <View style={styles.searchWrapper}>
                    <TextInput
                        placeholder="Search a name"
                        value={search}
                        onChangeText={searchName}
                        containerStyle={styles.input} />
                </View>

                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadProfiles}
                    />
                }>
                    <View style={styles.content}>
                        {isLoading && <LoadingIndicator />}

                        {!isLoading && (
                            <>
                                {filteredAllMembers.length == 0 && <NoData>No Member Available</NoData>}
                                {filteredAllMembers.map((member, index) => {
                                    return (
                                        <TouchableOpacity style={styles.list} key={index} onPress={() => {
                                            createDirect(member);
                                        }}>
                                            {member.image == null && <Image source={ImageUtils.defaultImage} style={styles.image} resizeMode='cover' />}
                                            {member.image != null && <Image source={{ uri: member.image }} style={styles.image} resizeMode='cover' />}
                                            <View style={styles.listContent}>
                                                <Text style={styles.name}>{member.label}</Text>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={styles.badge}>
                                                        {profile.is_trainer == true ?
                                                            <Text style={styles.badgeText}>Member</Text> :
                                                            <Text style={styles.badgeText}>Trainer</Text>}
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {isSaving && (
                <View style={styles.loading}>
                    <LoadingIndicator />
                </View>
            )}
        </>
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
    searchWrapper: {
        paddingHorizontal: 20,
        paddingTop: 20,
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
        padding: 6,
    },
    listContent: {
        justifyContent: 'center',
        flex: 1,
        marginLeft: 10,
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
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: {
        fontFamily: font.sourceSansPro,
        fontSize: 16,
        color: color.black,
        marginBottom: 4,
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
    },

    badge: {
        backgroundColor: color.success,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 5,
    },
    badgeText: {
        fontFamily: font.sourceSansPro,
        fontSize: 14,
        color: color.white,
    },

    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
};