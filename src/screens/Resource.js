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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoPlayer from '../components/VideoPlayer';
import { HttpRequest, HttpResponse, HttpUtils } from '../utils/http';
import Toast from '../components/Toast';
import _ from 'lodash';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Workout(props) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [isLoading, setLoading] = useState(false);
    const [workoutCategories, setWorkoutCategories] = useState([]);

    const workoutList = useMemo(() => {
        if (selectedCategory === null) {
            return [];
        }

        return workoutCategories[selectedCategory];
    }, [workoutCategories, selectedCategory]);

    useEffect(() => {
        loadWorkoutVideos();
    }, []);

    const loadWorkoutVideos = useCallback(() => {
        setLoading(true);

        HttpRequest.getWorkoutVideoList().then((res) => {
            console.log("Result", res.data.results);
            let _allVideo = res.data.results;

            var grouped = _.mapValues(_.groupBy(_allVideo, 'body_category'), clist => clist.map(vid => _.omit(vid, 'body_category')));
            console.log("Grouped", grouped);

            setLoading(false);
            setWorkoutCategories(grouped);
            if (Object.keys(grouped).length > 0) {
                setSelectedCategory(Object.keys(grouped)[0]);
            }
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
                    <View style={styles.categoriesWrap}>
                        <ScrollView horizontal>
                            <View style={styles.categories}>
                                {Object.keys(workoutCategories).map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={[styles.category, item == selectedCategory ? styles.categoryActive : null]} onPress={() => {
                                            setSelectedCategory(item);
                                        }}>
                                            <Text style={styles.categoryText}>{item}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                    <ScrollView refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={loadWorkoutVideos} />
                    }>
                        {workoutList.map((item, index) => {
                            return (
                                <View key={selectedCategory + index} style={styles.item}>

                                    {/* <CustomVideoPlayer
                                        resizeMode="cover"
                                        source={{ uri: HttpUtils.normalizeUrl(item.video_file) }}
                                        style={styles.video}
                                    /> */}

                                    <VideoPlayer source={{ uri: HttpUtils.normalizeUrl(item.video_file) }} style={styles.video} />

                                    <View style={styles.videoContent}>
                                        <Text style={styles.videoLabel}>{item.name}</Text>
                                        <Text style={styles.videoDescription}>{item.description}</Text>
                                    </View>

                                    <View style={styles.section} key={index}>
                                        <View style={styles.sectionRow}>
                                            <Text style={styles.sectionLabel}>Excercise instruction</Text>
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
                                </View>
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
    categoriesWrap: {
        height: 55,
    },
    categories: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    category: {
        backgroundColor: color.white,
        borderRadius: 10,
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryActive: {
        backgroundColor: "#E5EBEE",
    },
    categoryText: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    video: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 0.6,
        backgroundColor: color.black,
    },
    videoContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    videoLabel: {
        fontSize: 16,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
        marginBottom: 10,
    },
    videoDescription: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },



    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "rgba(229, 235, 238, 1)"
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
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.text,
        flex: 1,
    },
    sectionTime: {
        fontSize: 14,
        fontFamily: font.sourceSansPro,
        color: color.text,
    },
    sectionQty: {
        fontSize: 20,
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