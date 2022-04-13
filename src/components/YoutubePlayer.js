import React from 'react';
import YPlayer from "react-native-youtube-iframe";

export default function YoutubePlayer(props) {
    return (
        <YPlayer {...props} />
    );
}