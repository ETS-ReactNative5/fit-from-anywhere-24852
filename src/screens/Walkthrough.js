import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Text,
	View,
	StatusBar,
	Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AppIntroSlider from 'react-native-app-intro-slider';
import { font } from "../utils/font";
import color from "../utils/color";
import { Dimensions } from 'react-native';
import Button from '../components/Button';

export default function Walkthrough({ navigation }) {
	const { width, height } = Dimensions.get('window')

	const slides = [
		{
			key: 1,
			title: 'Fresh Ingredients',
			text: 'Starting from a simple belief that conscious agriculture has the power to change facts',
			image: require('../assets/images/walkthrough1.jpeg'),
		},
		{
			key: 2,
			title: 'Delivery With Services',
			text: 'Support our farmers, it can be as easy as making local agricultural products the main choice ',
			image: require('../assets/images/walkthrough2.jpg'),
		},
		{
			key: 3,
			title: 'One Price,\nFor All',
			text: 'Sprig offers a price system for cirrhosis that is fair to our farmers, according to the needs',
			image: require('../assets/images/walkthrough3.jpg'),
		},
	];

	const dispatch = useDispatch();
	const [showRealApp, setShowRealApp] = useState(false)
	const Home = 'home'

	const _renderItem = ({ item }) => {
		return (
			<View style={styles.container}>
				<View style={styles.topSide}>
					<StatusBar backgroundColor='black' translucent={true} />

					<Image source={item.image} style={styles.background} />
					<View style={{ paddingHorizontal: 40 }}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.subtitle}>{item.text}</Text>
						<View style={{ flexDirection: 'row', marginTop: 20, }}>
							<View style={{ width: 60, height: 50, justifyContent: 'center', alignItems: 'center' }}>
								{item.key > 1 && <Text style={styles.prev}>PREV</Text>}
							</View>
							<View style={{ flex: 1, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								{slides.map((slide, key) => {
									return (
										<View style={[styles.dot, slide.key == item.key ? styles.dotActive : null]} key={key} />
									);
								})}
							</View>
							<View style={{ width: 60, height: 50, justifyContent: 'center', alignItems: 'center' }}>
								{item.key < 3 && <Text style={styles.next}>NEXT</Text>}
							</View>
						</View>


					</View>
					{/* <ActivityIndicator color={color.red} size='large' /> */}
				</View>
				{item.key == 3 && (
					<View style={{
						position: 'absolute',
						bottom: 150,
						width: '100%',
						paddingHorizontal: 40,
					}}>
						<Button onPress={() => {
							navigation.navigate("Home");
						}}>GET STARTED</Button>
					</View>
				)}
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<AppIntroSlider
				renderItem={_renderItem}
				data={slides}
				// onDone={_onDone}
				showNextButton={false}
				showDoneButton={false}
				// renderNextButton={() => null}
				// renderDoneButton={() => null}
				dotStyle={{ backgroundColor: "transparent" }}
				activeDotStyle={{ backgroundColor: "transparent" }} />
		</SafeAreaView>
	);
}

const styles = {
	container: {
		flex: 1,
	},
	title: {
		color: color.Walkthrough,
		fontFamily: font.robotobold,
		fontSize: 40, fontWeight: '900'
	},
	subtitle: {
		color: color.text,
		lineHeight: 26,
		marginTop: 25,
		fontFamily: font.robotoregular, fontSize: 20,
		fontWeight: 'normal',
	},
	dot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: "#ffd5c6",// "#fe9870",
		marginHorizontal: 5,
	},
	dotActive: {
		backgroundColor: "#fe9870",
	},
	button: {
		backgroundColor: '#00FF00',
		padding: 10,
		marginTop: 10,
	},
	background: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		bottom: 0
	},
	topSide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	paginationWrapper: {
		position: 'absolute',
		bottom: 200,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	paginationDots: {
		height: 10,
		width: 10,
		borderRadius: 10 / 2,
		backgroundColor: '#0898A0',
		marginLeft: 10,
	},
	prev: {
		color: "#86898e",
		fontSize: 16,
	},
	next: {
		color: "#fe9870",
		fontSize: 16,
	},
};