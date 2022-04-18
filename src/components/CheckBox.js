import React from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import color from '../utils/color';
import { font } from '../utils/font';

export default function CheckBox(props) {



    return (
        <View style={styles.row}>
            {props.value == true ? <MaterialCommunityIcons name='radiobox-marked' size={30} color={color.primary} /> :
                <MaterialCommunityIcons name='radiobox-blank' size={30} color={color.primary} />}

            <Text style={styles.label}>{props.title}</Text>
        </View>
    );
}

const styles = {
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontFamily: font.sourceSansPro,
        color: color.primary,
        marginLeft: 5,
    }
};