import React, { Component } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import color from "../utils/color";

export default function ProgressBar(props) {
    const percentage = props.percentage;

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <View style={[styles.bar, { width: percentage + "%" }]} />
            </View>
        </View>
    );
}

const styles = {
    container: {
        paddingVertical: 5,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#eaeaea",
        borderRadius: 5,
        flexDirection: "row",
    },
    bar: {
        backgroundColor: color.primary,
        borderRadius: 5,
    }
};