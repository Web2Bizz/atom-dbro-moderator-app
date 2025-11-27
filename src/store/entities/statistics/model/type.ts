export interface Statistics {
	citiesCount: number
	regionsCount: number
	usersCount: number
	organizationsCount: number
	totalQuests: number
	activeQuests: number
	completedQuests: number
}

// На случай, если бэкенд вернет объект в формате { data: { ... } }
export interface StatisticsResponse {
	data: Statistics
}


