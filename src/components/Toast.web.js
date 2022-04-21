import React from 'react';
import { View, StyleSheet } from 'react-native';

var notyf = new Notyf({
    // delay time
    // 0 = infinite duration
    duration: 2000,
    // enable ripple effect
    ripple: true,
    // custom position
    position: { x: 'center', y: 'top' },
    // allow users to dismiss notifications via button
    dismissible: true,
});

export default {
    showError: (message, duration = 3000, isGlobal = true) => {
        notyf.error(message);
    },
    showSuccess: (message, duration = 3000, isGlobal = true) => {
        notyf.success(message);
    },
};

const styles = StyleSheet.create({
    closeButton: {
        width: 20,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginLeft: 5,
    },

    checkButton: {
        width: 20,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginLeft: 5,
    },
});
