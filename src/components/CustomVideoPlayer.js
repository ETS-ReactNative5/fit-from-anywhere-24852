import React from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Dimensions, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
//import VideoPlayer from 'react-native-video-player'
import VideoPlayer from 'react-native-video-controls';
import StyleUtils from '../utils/StyleUtils';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = StyleUtils.getScreenWidth();


class CustomVideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFullScreen: false,
        };

        this.videoPlayer = null;
        this.videoPlayerFullScreen = null;
        this.currentTime = 0;
        this.currentTimeFullScreen = 0;
    }

    presentFullscreen() {
        const videoComponent = this.videoPlayer.player.ref // <-- the <Video> component reference
        videoComponent.presentFullscreenPlayer();
        //videoComponent.seek(this.currentTime);
    }

    dismissFullscreen() {
        const videoComponent = this.videoPlayer.player.ref // <-- the <Video> component reference
        videoComponent.dismissFullscreenPlayer();
        videoComponent.seek(this.currentTimeFullScreen);
    }

    render() {
        if (Platform.OS === 'ios') {
            let defaultStyleIOS = {
                width: 300,
                height: 200,
            }

            let combinedStyle = [defaultStyleIOS, this.props.style];

            return (
                <View style={[styles.normal, defaultStyleIOS]}>
                    <VideoPlayer
                        {...this.props}
                        videoStyle={combinedStyle}
                        style={combinedStyle}
                        disableVolume={true}
                        disableBack={true}
                        disableFullscreen={true}
                        tapAnywhereToPause={true}
                        autoplay={false}
                        paused={true}
                        onEnterFullscreen={() => {
                            this.setState({ isFullScreen: true });
                            this.presentFullscreen();
                        }}
                        ref={(ref) => {
                            this.videoPlayer = ref;
                        }} />

                    {/* <TouchableOpacity
                        style={styles.buttonFullScreen}
                        onPress={() => {
                            this.presentFullscreen();
                        }}>
                        <MaterialCommunityIcons name='fullscreen' size={30} color='#fff' />
                    </TouchableOpacity> */}
                </View>
            );
        }

        let { isFullScreen } = this.state;

        let defaultStyle = {
            width: 300,
            height: 200,
        }

        let normalStyle = [defaultStyle, this.props.style];

        return (
            <View style={[styles.normal, defaultStyle]}>
                <VideoPlayer
                    {...this.props}
                    onProgress={(data) => {
                        //console.log('onProgress', data);
                        this.currentTime = data.currentTime;
                    }}
                    videoStyle={normalStyle}
                    style={normalStyle}
                    onEnterFullscreen={() => {
                        // this.setState({ isFullScreen: true });
                        // this.presentFullscreen();
                    }}
                    onExitFullscreen={() => {

                    }}
                    toggleResizeModeOnFullscreen={false}
                    fullscreen={false}
                    disableVolume={true}
                    disableBack={true}
                    disableFullscreen={true}
                    tapAnywhereToPause={true}
                    autoplay={false}
                    paused={true}
                    ref={(ref) => {
                        this.videoPlayer = ref;
                    }} />

                {/* <TouchableOpacity
                    style={styles.buttonFullScreen}
                    onPress={() => {
                        this.setState({ isFullScreen: true });
                        this.presentFullscreen();
                    }}>
                    <MaterialCommunityIcons name='fullscreen' size={30} color='#fff' />
                </TouchableOpacity> */}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isFullScreen}
                    onRequestClose={() => {
                        this.setState({ isFullScreen: false });
                    }}
                >
                    <VideoPlayer
                        {...this.props}
                        toggleResizeModeOnFullscreen={false}
                        resizeMode="contain"
                        onProgress={(data) => {
                            //console.log('onProgress', data);
                            this.currentTimeFullScreen = data.currentTime;
                        }}
                        videoStyle={styles.fullScreen}
                        style={styles.fullScreen}
                        onEnterFullscreen={() => {
                            //this.setState({ isFullScreen: true });
                            //this.presentFullscreen();
                        }}
                        onExitFullscreen={() => {
                            // this.setState({ isFullScreen: false });
                            // this.dismissFullscreen();
                        }}
                        onReadyForDisplay={() => {
                            this.videoPlayerFullScreen.player.ref.seek(this.currentTime);
                        }}
                        fullscreen={true}
                        disableVolume={true}
                        disableBack={true}
                        disableFullscreen={true}
                        tapAnywhereToPause={true}
                        autoplay={false}
                        paused={false}
                        ref={(ref) => {
                            this.videoPlayerFullScreen = ref;
                        }} />

                    <TouchableOpacity
                        style={styles.buttonFullScreen}
                        onPress={() => {
                            this.setState({ isFullScreen: false });
                            this.dismissFullscreen();
                        }}>
                        <MaterialCommunityIcons name='fullscreen' size={30} color='#fff' />
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    normal: {
        position: 'relative'
    },
    buttonFullScreen: {
        position: 'absolute',
        right: 0,
        top: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
})

export default CustomVideoPlayer