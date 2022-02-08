import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
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
import CustomVideoPlayer from '../components/CustomVideoPlayer';

let categories = [
    {
        label: "Push Ups",
        items: [
            {
                label: "Push Ups",
                description: "A push-up is a common calisthenics exercise beginning from the prone position. By raising and lowering the body using the arms, push-ups exercise the pectoral muscles, triceps, and anterior deltoids, with ancillary benefits to the rest of the deltoids, serratus anterior, coracobrachialis and the midsection as a whole.",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            },
            {
                label: "Push Ups with Feet on Bench",
                description: "A push-up is a common calisthenics exercise beginning from the prone position. By raising and lowering the body using the arms, push-ups exercise the pectoral muscles, triceps, and anterior deltoids, with ancillary benefits to the rest of the deltoids, serratus anterior, coracobrachialis and the midsection as a whole.",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            }
        ],
    },
    {
        label: "Bench Press",
        items: [
            {
                label: "Bench Press",
                description: "A bench press is a weight training exercise in which a weight is lifted from a weight rack and placed on the bench. The weight is then lowered to the ground by the use of the arms, with the elbows bent at 90 degrees.",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            }
        ],
    },
    {
        label: "Sit Ups",
        items: [
            {
                label: "Sit Ups",
                description: "A sit-up is a strength training exercise in which the upper body is supported by the lower body by using the arms and legs to lift the body off the floor.",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            }
        ],
    },
    {
        label: "Barbell Bicep Curls",
        items: [
            {
                label: "Barbell Bicep Curls",
                description: "A bicep curl is a weight training exercise in which a barbell is held overhead with the arms extended in front of the body. The weight is then lifted by the arms and lowered to the ground by the elbows.",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            }
        ],
    },
];

export default function Workout(props) {
    const [selectedCategory, setSelectedCategory] = useState(0);

    let workout = categories[selectedCategory];

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Workout Library" onLeftClick={() => {
                props.navigation.openDrawer();
            }} />
            <View style={styles.categoriesWrap}>
                <ScrollView horizontal>
                    <View style={styles.categories}>
                        {categories.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={[styles.category, index == selectedCategory ? styles.categoryActive : null]} onPress={() => {
                                    setSelectedCategory(index);
                                }}>
                                    <Text style={styles.categoryText}>{item.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
            <ScrollView>
                {workout.items.map((item, index) => {
                    return (
                        <View key={index} style={styles.item}>

                            <CustomVideoPlayer
                                resizeMode="cover"
                                source={{ uri: item.videoUrl }}
                                style={styles.video}
                            />
                            <View style={styles.videoContent}>
                                <Text style={styles.videoLabel}>{item.label}</Text>
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
        height: 300,
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