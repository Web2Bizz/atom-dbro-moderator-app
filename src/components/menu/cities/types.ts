export interface City {
	id: number
	name: string
	latitude: number
	longitude: number
	regionId: number
}

export type CityFormData = Omit<City, 'id'>

