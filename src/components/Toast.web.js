import React from 'react';
import { View, StyleSheet } from 'react-native';

export default {
    showError: (message, duration = 3000, isGlobal = true) => {
        alert(message);
    },
    showSuccess: (message, duration = 3000, isGlobal = true) => {
        alert(message);
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
