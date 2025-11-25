export {
	cityService,
	useCreateCityMutation,
	useCreateManyCitiesMutation,
	useDeleteCityMutation,
	useGetCitiesQuery,
	useGetCityByIdQuery,
	useUpdateCityMutation,
} from './model/city-service'
export type {
	City,
	CityListResponse,
	CityResponse,
	CreateCityRequest,
	GetCitiesParams,
	UpdateCityRequest,
} from './model/type'
