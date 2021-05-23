// Components
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'

import map from './reducer';

const env = process.env.NODE_ENV

const appReducers = {
  map
}

const config = {
  whitelist: ['SET_TO_LOCALSTORE'],
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['map']
}

const rootReducer = combineReducers({
  ...appReducers
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = [thunk, createStateSyncMiddleware(config)];

export const store = createStore(persistedReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);

initMessageListener(store);
