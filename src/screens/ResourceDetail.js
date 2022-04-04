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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import ImageUtils from '../utils/ImageUtils';
import { HttpUtils } from '../utils/http';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ResourceDetail(props) {
    const { resource } = props.route.params;

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={"Resource Library"}
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }} />
            <ScrollView>
                <View style={styles.content}>
                    <Text style={styles.header}>{resource.title}</Text>

                    {resource.image == null && <Image source={ImageUtils.home1} style={styles.itemThumbnail} />}
                    {resource.image != null && <Image source={{ uri: HttpUtils.normalizeUrl(resource.image) }} style={styles.itemThumbnail} />}

                    <Text style={styles.description}>{resource.description}</Text>
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
    header: {
        fontSize: 20,
        fontFamily: font.sourceSansProBold,
        color: color.primary,
        marginBottom: 20,
    },
    itemThumbnail: {
        width: SCREEN_WIDTH - 40,
        height: (SCREEN_WIDTH - 40) * 0.6,
        borderRadius: 10,
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.black,
    },
};