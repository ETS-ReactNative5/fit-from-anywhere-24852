import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
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

export default function MessageCreateGroup(props) {
    const profile = useSelector((state) => state.profile);
    const pubnub = usePubNub();

    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        loadProfiles();

        setMembers([{
            id: profile.user.id + "",
            label: profile.user.name,
            image: HttpUtils.normalizeUrl(profile.profile_image),
        }]);
    }, [profile]);

    const setNameImage = useCallback((name, image) => {
        setName(name);
        setImage(image);
    }, []);

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

    const saveGroup = useCallback(() => {
        if (name.length == "") {
            Toast.showError("Please enter group name");
            return;
        }

        if (members.length == 0) {
            Toast.showError("Please select members");
            return;
        }

        if (description.length == 0) {
            Toast.showError("Please enter group description");
            return;
        }

        setSaving(true);

        const uuidArr = uuidv4().split("-");
        const lastUuid = uuidArr[uuidArr.length - 1];

        const channelName = "group." + slugify(name, { lower: true }) + "-" + lastUuid;

        pubnub.objects.setChannelMetadata({
            channel: channelName,
            data: {
                name,
                description,
                custom: {
                    image,
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
                    uuids: members.map((item) => item.id),
                }).then((res2) => {
                    console.log("setChannelMembers", res2);
                    if (res2.status == 200) {

                        setSaving(false);
                        props.navigation.goBack();
                    } else {
                        Toast.showError("Cannot set channel member, please try again");
                        setSaving(false);
                    }
                })
            } else {
                Toast.showError("Cannot create channel, please try again");
                setSaving(false);
            }
        })
    }, [name, image, description, members]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title='Create Group'
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }}
                rightIcon={<MaterialCommunityIcons name='content-save' size={25} color={color.white} />}
                onRightClick={() => {
                    saveGroup();
                }}
            />
            <ScrollView>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.card} onPress={() => {
                        props.navigation.navigate("MessageEditGroupInfo", {
                            name, image, setNameImage
                        });
                    }}>
                        <Text style={styles.title}>NAME</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {image == null && <Image source={require('../assets/images/no-image.png')} style={styles.image} resizeMode='cover' />}
                            {image != null && <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />}
                            <Text style={styles.name}>{name != "" ? name : "(Insert Group Name)"}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Text style={styles.title}>DESCRIPTION</Text>

                        <TextInput value={description}
                            onChangeText={setDescription}
                            placeholder='Enter group description'
                            style={styles.desc} />
                    </View>

                    <View style={styles.card}>
                        <Combobox
                            selectedValue={null}
                            data={allMembers}
                            icon={<Entypo name='shop' size={20} color={color.primaryDark} />}
                            onValueChange={(val, itemIndex) => {
                                let newMembers = [...members];
                                let _member = allMembers.find((member) => member.id == val);
                                newMembers.push(_member);
                                setMembers(newMembers);
                            }}
                            renderDisplay={() => {
                                return (
                                    <>
                                        <View style={styles.circle}>
                                            <MaterialCommunityIcons name='plus' size={25} color={color.black} />
                                        </View>
                                        <Text style={styles.addMemberText}>Add new member</Text>
                                    </>
                                );
                            }}
                            style={styles.addMember}
                        />

                        <Text style={styles.title}>MEMBERS</Text>

                        {members.length == 0 && <NoData>No Member Available</NoData>}
                        {members.map((member, index) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} key={index}>
                                    {member.image == null && <Image source={require('../assets/images/no-image.png')} style={styles.image} resizeMode='cover' />}
                                    {member.image != null && <Image source={{ uri: member.image }} style={styles.image} resizeMode='cover' />}
                                    <Text style={styles.name}>{member.label}</Text>
                                </View>
                            );
                        })}
                    </View>
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
        paddingHorizontal: 20,
    },
    card: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.gray,
        marginTop: 10,
    },
    title: {
        fontSize: 10,
        color: color.black + "70",
        fontWeight: '600',
        marginBottom: 7,
    },
    image: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    name: {
        fontWeight: '600',
        fontSize: 14,
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