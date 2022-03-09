import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput as Input, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import color from '../utils/color';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { font } from '../utils/font';

export default function TextInput(props) {
    const [showPassword, setShowPassword] = useState(false);

    let isSecureTextEntry = props.secureTextEntry ?? false;

    const togglePassword = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    return (
        <View style={[styles.container, props.containerStyle]}>
            {props.label != null && <Text style={styles.label}>{props.label}</Text>}
            <View style={[styles.inputContainer, props.wrapperStyle]}>
                {props.icon}

                <View style={{ width: 10 }} />

                {isSecureTextEntry == false && (
                    <>
                        <Input {...props} style={styles.input} secureTextEntry={false} autoCapitalize='none' autoCorrect={false} />
                    </>
                )}

                {isSecureTextEntry == true && (
                    <>
                        <Input {...props} style={[styles.input, props.inputStyle]} secureTextEntry={!showPassword} autoCapitalize='none' autoCorrect={false} />
                        <TouchableOpacity style={styles.eyeButton} onPress={togglePassword}>
                            {showPassword && <MaterialCommunityIcons name='eye-off-outline' size={20} color={color.gray} />}
                            {!showPassword && <MaterialCommunityIcons name='eye-outline' size={20} color={color.gray} />}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {


    },
    label: {
        fontSize: 14,
        color: color.black,
        marginBottom: 5,
    },
    inputContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: color.border,
        height: 55,
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        fontFamily: font.sourceSansPro,
        fontSize: 16,
    },
    eyeButton: {
        paddingLeft: 15,
        paddingVertical: 10,
    },
});