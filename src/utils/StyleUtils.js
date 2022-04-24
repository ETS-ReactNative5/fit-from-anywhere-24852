import { Dimensions, Platform } from "react-native"

export default {
    regularShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },

    getScreenWidth: () => {
        if (Platform.OS == 'web') {
            let innerWidth = window.innerWidth;
            if (innerWidth > 600) {
                innerWidth = 600;
            }
            return innerWidth
        } else {
            return Dimensions.get('window').width;
        }
    }
}