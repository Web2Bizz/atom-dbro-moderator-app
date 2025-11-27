import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { achievementService } from './entities/achievement'
import { authService } from './entities/auth'
import { categoryService } from './entities/category'
import { cityService } from './entities/city'
import { experienceService } from './entities/experience'
import { helpTypeService } from './entities/help-type'
import { organizationService } from './entities/organization'
import { organizationTypeService } from './entities/organization-type'
import { questService } from './entities/quest'
import { questUpdateService } from './entities/quest-update'
import { regionService } from './entities/region'
import { statisticsService } from './entities/statistics'
import { uploadService } from './entities/upload'
import { userService } from './entities/user'

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['authApi'], // Сохраняем данные аутентификации
	serialize: true,
	deserialize: true,
}

const rootReducer = combineReducers({
	[authService.reducerPath]: authService.reducer,
	[userService.reducerPath]: userService.reducer,
	[regionService.reducerPath]: regionService.reducer,
	[cityService.reducerPath]: cityService.reducer,
	[organizationTypeService.reducerPath]: organizationTypeService.reducer,
	[helpTypeService.reducerPath]: helpTypeService.reducer,
	[organizationService.reducerPath]: organizationService.reducer,
	[categoryService.reducerPath]: categoryService.reducer,
	[achievementService.reducerPath]: achievementService.reducer,
	[questService.reducerPath]: questService.reducer,
	[questUpdateService.reducerPath]: questUpdateService.reducer,
	[uploadService.reducerPath]: uploadService.reducer,
	[experienceService.reducerPath]: experienceService.reducer,
	[statisticsService.reducerPath]: statisticsService.reducer,
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
			}).concat(
				authService.middleware,
				userService.middleware,
				regionService.middleware,
				cityService.middleware,
				organizationTypeService.middleware,
				helpTypeService.middleware,
				organizationService.middleware,
				categoryService.middleware,
				achievementService.middleware,
				questService.middleware,
				questUpdateService.middleware,
				uploadService.middleware,
				experienceService.middleware,
				statisticsService.middleware
			),
	})

	const persistor = persistStore(store)

	return { store, persistor }
}

export type AppStore = ReturnType<typeof setupStore>['store']
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppPersistor = ReturnType<typeof setupStore>['persistor']
