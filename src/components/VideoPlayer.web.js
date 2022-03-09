import React, { useRef, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import color from "../utils/color";

export default function VideoPlayer(props) {

    return (
        <View style={styles.container}>
            <video width={props.style.width} height={props.style.height} controls>
                <source src={props.source.uri} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </View>
    );
}

const styles = {
    container: {
        position: 'relative',
    },
    boxWrap: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
};