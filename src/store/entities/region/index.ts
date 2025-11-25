export {
	regionService,
	useCreateRegionMutation,
	useDeleteRegionMutation,
	useGetCitiesByRegionQuery,
	useGetRegionByIdQuery,
	useGetRegionsQuery,
	useUpdateRegionMutation,
} from './model/region-service'
export type {
	CreateRegionRequest,
	Region,
	RegionListResponse,
	RegionResponse,
	UpdateRegionRequest,
} from './model/type'
