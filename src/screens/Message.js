import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    RefreshControl,
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
import NoData from '../components/NoData';
import { useFocusEffect } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import { useSelector } from 'react-redux';

export default function Message(props) {
    const pubnub = usePubNub();
    const profile = useSelector((state) => state.profile);
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(useCallback(() => {
        getMembership();
    }, []));

    const getMembership = useCallback(() => {
        setIsLoading(true);
        pubnub.objects.getMemberships({
            uuid: profile.user.id + "",
            include: {
                totalCount: true,
                customFields: true,
                channelFields: true,
                customChannelFields: true,
            },
            sort: { "channel.updated": "desc" }
        }).then((res) => {
            console.log("getMembership", res);
            setChannels(res.data);
            setIsLoading(false);
        })
    }, [pubnub, profile]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Messages"
                rightIcon={<MaterialCommunityIcons name='plus' size={25} color={color.white} />}
                onRightClick={() => {
                    props.navigation.navigate("MessageCreateGroup");
                }} />

            <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={getMembership} />}>
                <View style={styles.content}>
                    {channels.length == 0 && <NoData>No Message Available</NoData>}
                    {channels.map((message, index) => {
                        let image = message.channel.custom?.image;
                        let totalMember = message.channel.custom?.total_member ?? 1;

                        return (
                            <TouchableOpacity style={styles.message} key={index} onPress={() => {
                                props.navigation.navigate("MessageDetail", {
                                    message,
                                });
                            }}>
                                {image == null && <Image source={require('../assets/images/no-image.png')} style={styles.image} resizeMode='cover' />}
                                {image != null && <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />}
                                <View style={styles.messageContent}>
                                    <Text style={styles.title}>{message.channel.name}</Text>
                                    <Text style={styles.description}>{totalMember} member{totalMember != 1 ? "s" : ""}</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color={color.black} />
                            </TouchableOpacity>
                        );
                    })}
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
    message: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.gray,
        marginTop: 10,
    },
    messageContent: {
        flex: 1,
        marginLeft: 10,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 18,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: color.black,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        fontWeight: '400',
        color: color.black,
    },
};