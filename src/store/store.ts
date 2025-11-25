import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authService } from './entities/auth'

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['authApi'], // Сохраняем данные аутентификации
	serialize: true,
	deserialize: true,
}

const rootReducer = combineReducers({
	[authService.reducerPath]: authService.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const setupStore = () => {
	const store = configureStore({
		reducer: persistedReducer,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [
						'persist/PERSIST',
						'persist/REHYDRATE',
						'persist/PAUSE',
						'persist/PURGE',
						'persist/REGISTER',
					],
					ignoredPaths: ['_persist'],
				},
			}).concat(authService.middleware),
	})

	const persistor = persistStore(store)

	return { store, persistor }
}

export type AppStore = ReturnType<typeof setupStore>['store']
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppPersistor = ReturnType<typeof setupStore>['persistor']
