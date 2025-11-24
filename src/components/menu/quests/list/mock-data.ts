import { type Quest } from '../types'
import { type QuestCategory } from '../../quest-categories/types'
import { type City } from '../../cities/types'
import { type OrganizationType } from '../../organizations/types'

export const mockQuestCategories: QuestCategory[] = [
	{
		id: 1,
		name: 'Экология',
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
	},
	{
		id: 2,
		name: 'Социальная помощь',
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
	},
	{
		id: 3,
		name: 'Образование',
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
	},
]

export const mockCities: City[] = [
	{
		id: 1081,
		name: 'Димитровград',
		latitude: 54.224,
		longitude: 49.595,
		regionId: 1,
	},
	{
		id: 1,
		name: 'Москва',
		latitude: 55.7558,
		longitude: 37.6173,
		regionId: 1,
	},
]

export const mockOrganizationTypes: OrganizationType[] = [
	{ id: 1, name: 'НКО' },
	{ id: 6, name: 'Здоровье и спорт' },
	{ id: 3, name: 'Благотворительный фонд' },
]

export const mockQuests: Quest[] = [
	{
		id: 4,
		title: 'dasdasd1',
		description: 'dasdasdasdasddasdasdasdasd',
		status: 'active',
		experienceReward: 100,
		achievementId: 8,
		ownerId: 17,
		cityId: 1081,
		organizationTypeId: 6,
		latitude: '54.22400050',
		longitude: '49.59503174',
		address: 'Куйбышева, 300',
		contacts: [
			{
				name: 'Имя',
				value: 'Иван Иванов',
			},
			{
				name: 'Телефон',
				value: '+79084880118',
			},
			{
				name: 'Email',
				value: 'i12van@example.com',
			},
			{
				name: 'Вконтакте',
				value: 'https://vk.ru/73дд3454',
			},
		],
		coverImage:
			'https://s3.ru1.storage.beget.cloud/f883e5baa86a-hardworking-katerina/images/39e4adf8-44dd-4aaa-83de-e63127371de2.jpeg',
		gallery: [
			'https://s3.ru1.storage.beget.cloud/f883e5baa86a-hardworking-katerina/images/6f79a6f1-e7d4-4371-8b5f-50d853f055b1.jpeg',
			'https://s3.ru1.storage.beget.cloud/f883e5baa86a-hardworking-katerina/images/385a70b6-a985-4fb0-88bb-b24f2b96fbab.jpeg',
		],
		steps: [
			{
				title: 'dasdasdasdasd',
				status: 'pending',
				progress: 0,
				description: 'dasdasdasdasd',
			},
		],
		createdAt: '2025-11-19T15:51:37.285Z',
		updatedAt: '2025-11-19T17:22:42.697Z',
		city: {
			id: 1081,
			name: 'Димитровград',
			latitude: 54.224,
			longitude: 49.595,
			regionId: 1,
		},
		organizationType: {
			id: 6,
			name: 'Здоровье и спорт',
		},
		categories: [mockQuestCategories[0]],
	},
	{
		id: 1,
		title: 'Очистка парка от мусора',
		description:
			'Организация субботника по очистке городского парка от мусора и озеленению территории',
		status: 'active',
		experienceReward: 50,
		achievementId: null,
		ownerId: 1,
		cityId: 1,
		organizationTypeId: 1,
		latitude: '55.7558',
		longitude: '37.6173',
		address: 'г. Москва, Центральный парк',
		contacts: [
			{
				name: 'Телефон',
				value: '+79001234567',
			},
		],
		coverImage: null,
		gallery: [],
		steps: [],
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
		city: mockCities[1],
		organizationType: mockOrganizationTypes[0],
		categories: [mockQuestCategories[0]],
	},
	{
		id: 3,
		title: 'Образовательные мастер-классы',
		description:
			'Проведение бесплатных образовательных мастер-классов для детей и подростков',
		status: 'completed',
		experienceReward: 75,
		achievementId: null,
		ownerId: 2,
		cityId: 1,
		organizationTypeId: 1,
		latitude: '55.7558',
		longitude: '37.6173',
		address: 'г. Москва, Центр образования',
		contacts: [
			{
				name: 'Email',
				value: 'education@example.com',
			},
		],
		coverImage: null,
		gallery: [],
		steps: [],
		createdAt: '2025-11-15T11:05:05.565Z',
		updatedAt: '2025-11-18T11:05:05.565Z',
		city: mockCities[1],
		organizationType: mockOrganizationTypes[0],
		categories: [mockQuestCategories[2]],
	},
]
