import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Modal,
} from 'react-native';

export default function DatePicker(props){
    return (
        <input type={'date'} value={props.value} onChange={props.onChange} />
    );
}