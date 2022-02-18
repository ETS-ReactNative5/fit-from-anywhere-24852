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
import LinearGradient from 'react-native-linear-gradient';
import { font } from "../utils/font";
import Video from "react-native-video";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function VideoPlayer(props) {
    const videoRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);

    return (
        <View style={styles.container}>
            <Video
                {...props}
                ref={videoRef}
                resizeMode='contain'
                playInBackground={false}
                paused={isPlaying ? false : true}
                onLoad={() => {
                    setIsReady(true);
                }}
            />

            <TouchableOpacity style={styles.playButton} onPress={() => {
                if (isReady) {
                    setIsPlaying(!isPlaying);
                }
            }}>
                {!isReady && (
                    <View style={styles.boxWrap}>
                        <ActivityIndicator size="large" color={color.white} />
                    </View>
                )}
                {isReady && (
                    <>
                        {!isPlaying && (
                            <View style={styles.boxWrap}>
                                <MaterialIcons name="play-arrow" size={50} color={color.white} />
                            </View>
                        )}
                    </>
                )}
                {/* {isPlaying && <MaterialIcons name="pause" size={50} color={color.white} />} */}
            </TouchableOpacity>
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