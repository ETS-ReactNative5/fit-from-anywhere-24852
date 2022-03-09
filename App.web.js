import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Provider as ReduxProvider, useDispatch } from "react-redux";

import { store } from "./src/store";
import NavigatorProvider from "./src/navigator/mainNavigator";
import { persistStore } from 'redux-persist';

console.disableYellowBox = true;

// Generate required css
import materialCommunityIconFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import entypoIconFont from 'react-native-vector-icons/Fonts/Entypo.ttf';
import featherIconFont from 'react-native-vector-icons/Fonts/Feather.ttf';
import ioniconsIconFont from 'react-native-vector-icons/Fonts/Ionicons.ttf';

const iconFontStyles = `
	@font-face {
	src: url(${materialCommunityIconFont});
	font-family: MaterialCommunityIcons;
  }
  @font-face {
	src: url(${entypoIconFont});
	font-family: Entypo;
  }
  @font-face {
	src: url(${featherIconFont});
	font-family: Feather;
  }
  @font-face {
	src: url(${ioniconsIconFont});
	font-family: Ionicons;
  }
`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
	style.styleSheet.cssText = iconFontStyles;
} else {
	style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);


export default function App(props) {
	const [ready, setReady] = useState(false);

	const loadInitialData = async () => {
		await new Promise(resolve => {
			persistStore(store, null, async () => {
				resolve(null);
			});
		});

		setReady(true);
	};

	useEffect(() => {
		loadInitialData();
	}, []);

	if (ready) {
		return (
			<ReduxProvider store={store}>
				<NavigatorProvider />
			</ReduxProvider>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	flex: { flex: 1 }
});