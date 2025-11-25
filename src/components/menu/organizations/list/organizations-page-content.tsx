'use client'

import {
	useDeleteOrganizationMutation,
	useGetCitiesQuery,
	useGetHelpTypesQuery,
	useGetOrganizationsQuery,
	useGetOrganizationTypesQuery,
	type Organization as ApiOrganization,
} from '@/store/entities'
import * as React from 'react'
import { toast } from 'sonner'
import { DeleteOrganizationDialog } from '../delete-organization-dialog'
import { type Organization } from '../types'
import { OrganizationsHeader } from './components/organizations-header'
import { OrganizationsTable } from './organizations-table'

// Преобразуем организацию из API в формат компонента
const mapApiOrganizationToComponentOrganization = (
	apiOrg: ApiOrganization
): Organization => {
	// Если API вернул объект city, используем его, иначе берем из cityId
	const cityFromApi = apiOrg.city
	const cityId = cityFromApi?.id || apiOrg.cityId

	return {
		id: apiOrg.id,
		name: apiOrg.name || '',
		latitude: apiOrg.latitude || 0,
		longitude: apiOrg.longitude || 0,
		summary: apiOrg.summary || '',
		mission: apiOrg.mission || '',
		description: apiOrg.description || '',
		goals: apiOrg.goals || [],
		needs: apiOrg.needs || [],
		address: apiOrg.address || '',
		contacts: (apiOrg.contacts || []).map(contact => ({
			name: contact.name,
			value: contact.value,
		})),
		gallery: apiOrg.gallery || [],
		createdAt: apiOrg.createdAt || new Date().toISOString(),
		updatedAt: apiOrg.updatedAt || new Date().toISOString(),
		city: cityFromApi
			? {
					id: cityFromApi.id,
					name: cityFromApi.name,
					latitude: Number(cityFromApi.latitude) || 0,
					longitude: Number(cityFromApi.longitude) || 0,
			  }
			: {
					id: cityId,
					name: '', // Будет заполнено из списка городов
					latitude: apiOrg.latitude || 0,
					longitude: apiOrg.longitude || 0,
			  },
		type: {
			id: apiOrg.typeId || apiOrg.organizationTypeId || 0,
			name: '', // Будет заполнено из списка типов организаций
		},
		helpTypes: (apiOrg.helpTypeIds || []).map(id => ({
			id,
			name: '', // Будет заполнено из списка типов помощи
		})),
	}
}

export function OrganizationsPageContent() {
	const {
		data: organizationsData,
		isLoading: isLoadingOrganizations,
		error: organizationsError,
	} = useGetOrganizationsQuery()

	const { data: citiesData } = useGetCitiesQuery()
	const { data: organizationTypesData } = useGetOrganizationTypesQuery()
	const { data: helpTypesData } = useGetHelpTypesQuery()

	const [deleteOrganization] = useDeleteOrganizationMutation()

	// Преобразуем данные из API
	const organizations = React.useMemo(() => {
		if (!organizationsData) return []
		const mapped = organizationsData.map(
			mapApiOrganizationToComponentOrganization
		)

		// Заполняем названия городов, типов и помощи
		// Если city уже заполнен из API, используем его, иначе ищем в списке городов
		return mapped.map(org => {
			// Если название города уже есть (пришло из API), используем его
			const cityFromList = org.city.name
				? null
				: citiesData?.find(c => c.id === org.city.id)
			const city = cityFromList
				? {
						...org.city,
						name: cityFromList.name,
						latitude: Number(cityFromList.latitude) || org.city.latitude,
						longitude: Number(cityFromList.longitude) || org.city.longitude,
				  }
				: org.city

			const type = organizationTypesData?.find(t => t.id === org.type.id)
			const helpTypes = org.helpTypes.map(ht => {
				const helpType = helpTypesData?.find(h => h.id === ht.id)
				return {
					...ht,
					name: helpType?.name || '',
				}
			})

			return {
				...org,
				city,
				type: type
					? {
							...org.type,
							name: type.name,
					  }
					: org.type,
				helpTypes,
			}
		})
	}, [organizationsData, citiesData, organizationTypesData, helpTypesData])

	React.useEffect(() => {
		if (organizationsError) {
			toast.error('Ошибка при загрузке организаций')
		}
	}, [organizationsError])

	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [organizationToDelete, setOrganizationToDelete] =
		React.useState<Organization | null>(null)

	const handleDeleteClick = (organization: Organization) => {
		setOrganizationToDelete(organization)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!organizationToDelete) return

		setIsLoading(true)
		try {
			await deleteOrganization(organizationToDelete.id).unwrap()
			toast.success('Организация успешно удалена')
			setDeleteDialogOpen(false)
			setOrganizationToDelete(null)
		} catch {
			toast.error('Ошибка при удалении организации')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<OrganizationsHeader />

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				{(() => {
					if (isLoadingOrganizations) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка организаций...
								</p>
							</div>
						)
					}
					if (organizationsError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке организаций
								</p>
							</div>
						)
					}
					return (
						<OrganizationsTable
							organizations={organizations}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
			</div>

			<DeleteOrganizationDialog
				organization={organizationToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
