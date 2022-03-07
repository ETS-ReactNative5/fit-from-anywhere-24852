import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import color from '../utils/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInput from '../components/TextInput';
import Toast from '../components/Toast';
import UploadImageView from '../components/UploadImageView';
import { FormDataConverter, HttpRequest, HttpUtils } from '../utils/http';

export default function MessageEditGroupInfo(props) {
    let params = props.route.params;
    // console.log("Params", params);


    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setName(params.name);
        setImage(params.image);
    }, []);

    const uploadImage = useCallback((path) => {
        setIsUploading(true);

        let data = FormDataConverter.convert({});
        data.append('image', {
            name: 'image-' + moment().format("YYYY-MM-DD-HH-mm-ss") + '.jpg',
            type: 'image/jpeg',
            uri: path,
        });

        HttpRequest.uploadImage(data).then((res) => {
            console.log("uploadImage", res.data);
            setImage(HttpUtils.normalizeUrl(res.data.image));
            setIsUploading(false);
        }).catch((err) => {
            console.log(err, err.response);
            Toast.showError(HttpResponse.processMessage(err.response, "Cannot load profile data"));
            setIsUploading(false);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header title='Edit Name'
                leftIcon={<MaterialCommunityIcons name="arrow-left" size={25} color={color.white} />}
                onLeftClick={() => {
                    props.navigation.goBack();
                }}
                rightIcon={<MaterialCommunityIcons name='content-save' size={25} color={color.white} />}
                onRightClick={() => {
                    props.navigation.goBack();
                    params.setNameImage(name, image);
                }}
            />
            <ScrollView>
                <View style={styles.content}>
                    <View style={{ alignItems: 'center' }}>
                        {isUploading && <ActivityIndicator />}

                        {!isUploading && (
                            <UploadImageView
                                // label="Upload image"
                                value={image}
                                containerStyle={styles.input}
                                onSelectImage={(imagePath) => {
                                    console.log("UploadImageView", imagePath);
                                    //setImage(imagePath);
                                    uploadImage(imagePath);
                                }} />
                        )}
                    </View>

                    <TextInput
                        label='Name'
                        placeholder="Enter group name"
                        value={name}
                        onChangeText={setName}
                        containerStyle={styles.input} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
    },
    card: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.border,
        marginBottom: 10,
    },
    title: {
        fontSize: 10,
        color: color.black + "70",
        fontWeight: '600',
        marginBottom: 7,
    },
    image: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    name: {
        fontWeight: '600',
        fontSize: 14,
        color: color.black,
        marginLeft: 10,
    },
    desc: {
        fontWeight: '400',
        fontSize: 12,
        color: color.black,
    },

    addMember: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMemberText: {
        fontWeight: '400',
        fontSize: 12,
        color: color.black,
        marginLeft: 10,
    }
};