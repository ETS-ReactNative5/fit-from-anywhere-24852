import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import VideoPlayer from '../components/VideoPlayer';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import Toast from '../components/Toast';
import _ from 'lodash';
import LoadingIndicator from '../components/LoadingIndicator';
import ImageUtils from '../utils/ImageUtils';
import CacheUtils from '../utils/CacheUtils';
import { useDispatch, useSelector } from 'react-redux';

export default function Workout(props) {
    const dispatch = useDispatch();
    const profiles = useSelector((state) => state.profiles);
    const [isLoading, setLoading] = useState(false);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        loadResourceLibrary();
    }, []);

    const loadResourceLibrary = useCallback(() => {
        setLoading(true);

        HttpRequest.getResourceLibrary().then((res) => {
            console.log("Result", res.data.results);
            res.data.results.forEach((item) => {
                CacheUtils.findProfile(item.user, dispatch);
            });
            setResources(res.data.results);
            setLoading(false);
        }).catch((err) => {
            Toast.showError(HttpResponse.processMessage(err.response, "Failed to load workout videos"));
            setLoading(false);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Resource Library" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            {isLoading && (
                <LoadingIndicator />
            )}

            {!isLoading && (
                <>
                    <ScrollView refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={loadResourceLibrary} />
                    }>
                        {resources.map((item, index) => {
                            let user = profiles[item.user];
                            return (
                                <TouchableOpacity key={index} style={styles.item} onPress={() => {
                                    props.navigation.navigate("ResourceDetail", {
                                        resource: item
                                    });
                                }}>
                                    {item.image == null && <Image source={ImageUtils.home1} style={styles.itemThumbnail} />}
                                    {item.image != null && <Image source={{ uri: HttpUtils.normalizeUrl(item.image) }} style={styles.itemThumbnail} />}
                                    <View style={styles.itemContent}>
                                        <Text style={styles.itemLabel}>{item.title}</Text>
                                        <Text style={styles.itemAuthor}>by {user?.user?.name}</Text>
                                        <Text style={styles.itemTime}>{moment(item.created_at).format("MMM DD, YYYY")}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        <View style={styles.line} />
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        // alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    itemThumbnail: {
        width: 80,
        height: 60,
        borderRadius: 10,
    },
    itemContent: {
        flex: 1,
        marginLeft: 10,
    },
    itemLabel: {
        fontSize: 17,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
        marginBottom: 2,
    },
    itemAuthor: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.black,
        // marginBottom: 5,
    },
    itemTime: {
        fontSize: 12,
        fontFamily: font.sourceSansPro,
        color: color.text,
        // marginBottom: 5,
    },
};