import { HttpUtils } from "./http";

import defaultImage from '../assets/images/no-image.png';
import profileImage from '../assets/images/profile.png';
import home1 from '../assets/images/home-1.jpg';
import home2 from '../assets/images/home-2.jpg';
import logoZoom from '../assets/images/logo-zoom.png';
import logoLetter from '../assets/images/logo-letter.png';
import logo from '../assets/images/logo.png';
import ImagePicker from "react-native-image-crop-picker";

export default {
    defaultImage,
    profileImage,

    home1,
    home2,

    logoZoom,
    logoLetter,
    logo,

    getSafeImage(url) {
        if (url) {
            return { uri: HttpUtils.normalizeUrl(url) };
        }
        return defaultImage;
    },
    getSafeImageUrl(url) {
        if (url) {
            return HttpUtils.normalizeUrl(url);
        }
        return "https://via.placeholder.com/150";
    },

    openCamera(params) {
        return ImagePicker.openCamera(params);
    },
    openPicker(params) {
        return ImagePicker.openPicker(params);
    },
}