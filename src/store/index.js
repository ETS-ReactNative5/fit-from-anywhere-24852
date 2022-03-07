import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user, splash, profile, isOnboarding, profiles } from './reducers';

const config = {
    key: 'primary',
    storage: AsyncStorage,
    whitelist: ['user', 'profile'],
};

const store = createStore(
    persistCombineReducers(config, { user, splash, isOnboarding, profile, profiles }),
    undefined,
    compose(applyMiddleware(thunk)),
);

export { store };