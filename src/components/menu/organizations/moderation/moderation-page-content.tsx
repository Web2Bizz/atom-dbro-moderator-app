'use client'

import * as React from 'react'

import { toast } from 'sonner'

import {
	useApproveOrganizationMutation,
	useDisapproveOrganizationMutation,
	useGetCitiesQuery,
	useGetHelpTypesQuery,
	useGetOrganizationsQuery,
	useGetOrganizationTypesQuery,
	type Organization as ApiOrganization,
	type City,
	type HelpType,
	type OrganizationType,
} from '@/store/entities'
import { EmptyState } from './components/empty-state'
import { FiltersBar } from './components/filters-bar'
import { ModerationHeader } from './components/moderation-header'
import { ModerationPagination } from './components/moderation-pagination'
import { OrganizationCard } from './components/organization-card'
import { OrganizationDetailDrawer } from './components/organization-detail-drawer'
import { RejectDialog } from './components/reject-dialog'

import { type Organization } from '@/components/menu/organizations/types'

// Преобразуем организацию из API в формат компонента
const mapApiOrganizationToComponentOrganization = (
	apiOrg: ApiOrganization,
	citiesData: City[] = [],
	organizationTypesData: OrganizationType[] = [],
	helpTypesData: HelpType[] = []
): Organization => {
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
					name: citiesData.find(c => c.id === cityId)?.name || '',
					latitude: apiOrg.latitude || 0,
					longitude: apiOrg.longitude || 0,
			  },
		type: apiOrg.type
			? {
					id: apiOrg.type.id,
					name: apiOrg.type.name,
			  }
			: {
					id: apiOrg.typeId || apiOrg.organizationTypeId || 0,
					name:
						organizationTypesData.find(
							t => t.id === (apiOrg.typeId || apiOrg.organizationTypeId)
						)?.name || '',
			  },
		helpTypes: apiOrg.helpTypes && apiOrg.helpTypes.length > 0
			? apiOrg.helpTypes.map(ht => ({
					id: ht.id,
					name: ht.name,
			  }))
			: (apiOrg.helpTypeIds || []).map(id => ({
					id,
					name: helpTypesData.find(h => h.id === id)?.name || '',
			  })),
	}
}

export function ModerationPageContent() {
	const {
		data: organizationsData,
		isLoading: isLoadingOrganizations,
		error: organizationsError,
	} = useGetOrganizationsQuery({ filteredByStatus: false })

	const { data: citiesData } = useGetCitiesQuery()
	const { data: organizationTypesData } = useGetOrganizationTypesQuery()
	const { data: helpTypesData } = useGetHelpTypesQuery()

	const [approveOrganization] = useApproveOrganizationMutation()
	const [disapproveOrganization] = useDisapproveOrganizationMutation()

	// Преобразуем данные из API и фильтруем только неодобренные организации
	// Предполагаем, что неодобренные - это те, у которых нет поля approved или оно false
	const organizations = React.useMemo(() => {
		if (!organizationsData) return []
		const mapped = organizationsData.map(apiOrg =>
			mapApiOrganizationToComponentOrganization(
				apiOrg,
				citiesData,
				organizationTypesData,
				helpTypesData
			)
		)
		// Фильтруем организации на модерации (предполагаем, что это все организации без approved статуса)
		// Если API возвращает только неодобренные, то фильтр не нужен
		// Фильтруем организации на модерации (предполагаем, что это все организации без approved статуса)
		// Если API возвращает только неодобренные, то фильтр не нужен

		return mapped
	}, [organizationsData, citiesData, organizationTypesData, helpTypesData])

	React.useEffect(() => {
		if (organizationsError) {
			toast.error('Ошибка при загрузке организаций')
		}
	}, [organizationsError])

	const [selectedOrganization, setSelectedOrganization] =
		React.useState<Organization | null>(null)
	const [isDetailOpen, setIsDetailOpen] = React.useState(false)
	const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
	const [rejectReason, setRejectReason] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)

	// Фильтры
	const [searchQuery, setSearchQuery] = React.useState('')
	const [selectedCity, setSelectedCity] = React.useState<string>('all')
	const [selectedType, setSelectedType] = React.useState<string>('all')
	const [sortBy, setSortBy] = React.useState<'date' | 'name'>('date')

	// Пагинация
	const [currentPage, setCurrentPage] = React.useState(1)
	const itemsPerPage = 8

	const localeCollator = React.useMemo(
		() => new Intl.Collator('ru', { sensitivity: 'base' }),
		[]
	)

	const formatDate = React.useCallback((dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}, [])

	const cities = React.useMemo(() => {
		const citySet = new Set(
			organizations
				.map(org => org.city.name)
				.filter(name => name && name.trim() !== '')
		)
		return Array.from(citySet).sort(localeCollator.compare)
	}, [organizations, localeCollator])

	const organizationTypes = React.useMemo(() => {
		const typeSet = new Set(
			organizations
				.map(org => org.type.name)
				.filter(name => name && name.trim() !== '')
		)
		return Array.from(typeSet).sort(localeCollator.compare)
	}, [organizations, localeCollator])

	const filteredOrganizations = React.useMemo(() => {
		let filtered = [...organizations]
		const query = searchQuery.trim().toLowerCase()

		if (query) {
			filtered = filtered.filter(org => {
				const matchesText =
					org.name.toLowerCase().includes(query) ||
					org.summary.toLowerCase().includes(query) ||
					org.city.name.toLowerCase().includes(query) ||
					org.type.name.toLowerCase().includes(query)

				const matchesHelpTypes = org.helpTypes.some(helpType =>
					helpType.name.toLowerCase().includes(query)
				)

				return matchesText || matchesHelpTypes
			})
		}

		if (selectedCity !== 'all') {
			filtered = filtered.filter(org => org.city.name === selectedCity)
		}

		if (selectedType !== 'all') {
			filtered = filtered.filter(org => org.type.name === selectedType)
		}

		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			}

			return localeCollator.compare(a.name, b.name)
		})

		return filtered
	}, [
		organizations,
		searchQuery,
		selectedCity,
		selectedType,
		sortBy,
		localeCollator,
	])

	// Сброс страницы при изменении фильтров
	React.useEffect(() => {
		setCurrentPage(1)
	}, [searchQuery, selectedCity, selectedType])

	// Пагинация
	const totalPages = React.useMemo(() => {
		const pages = Math.ceil(filteredOrganizations.length / itemsPerPage)
		return Math.max(1, pages)
	}, [filteredOrganizations.length, itemsPerPage])

	const paginatedOrganizations = React.useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return filteredOrganizations.slice(startIndex, endIndex)
	}, [filteredOrganizations, currentPage, itemsPerPage])

	const hasActiveFilters =
		searchQuery.trim() !== '' ||
		selectedCity !== 'all' ||
		selectedType !== 'all'

	const clearFilters = React.useCallback(() => {
		setSearchQuery('')
		setSelectedCity('all')
		setSelectedType('all')
		setSortBy('date')
		setCurrentPage(1)
	}, [])

	const handleViewDetails = (organization: Organization) => {
		setSelectedOrganization(organization)
		setIsDetailOpen(true)
	}

	const handleApprove = async (organization: Organization) => {
		setIsLoading(true)
		try {
			await approveOrganization(organization.id).unwrap()
			toast.success('Организация одобрена и опубликована')
			// Закрываем drawer, если открыт
			if (selectedOrganization?.id === organization.id) {
				setIsDetailOpen(false)
				setSelectedOrganization(null)
			}
		} catch {
			toast.error('Ошибка при одобрении организации')
		} finally {
			setIsLoading(false)
		}
	}

	const handleRejectClick = (organization: Organization) => {
		setSelectedOrganization(organization)
		setRejectReason('')
		setIsRejectDialogOpen(true)
	}

	const handleRejectConfirm = async () => {
		if (!selectedOrganization || !rejectReason.trim()) {
			toast.error('Укажите причину отклонения')
			return
		}

		setIsLoading(true)
		try {
			// Используем disapproveOrganization для отклонения
			// Если API требует причину, нужно будет добавить её в запрос
			await disapproveOrganization(selectedOrganization.id).unwrap()
			toast.success('Организация отклонена')
			setIsRejectDialogOpen(false)
			setSelectedOrganization(null)
			setRejectReason('')
		} catch {
			toast.error('Ошибка при отклонении организации')
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoadingOrganizations) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
				<div className='flex items-center justify-center py-8'>
					<p className='text-sm text-muted-foreground'>
						Загрузка организаций...
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<ModerationHeader
				filteredCount={filteredOrganizations.length}
				totalCount={organizations.length}
				hasActiveFilters={hasActiveFilters}
			/>

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				<FiltersBar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedCity={selectedCity}
					onCityChange={setSelectedCity}
					selectedType={selectedType}
					onTypeChange={setSelectedType}
					sortBy={sortBy}
					onSortChange={setSortBy}
					cities={cities}
					organizationTypes={organizationTypes}
					hasActiveFilters={hasActiveFilters}
					onClearFilters={clearFilters}
				/>

				{filteredOrganizations.length === 0 ? (
					<EmptyState
						hasActiveFilters={hasActiveFilters}
						onClearFilters={clearFilters}
					/>
				) : (
					<>
						<div
							className='grid gap-3 sm:gap-4 mt-4'
							style={{
								gridTemplateColumns:
									'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
							}}
						>
							{paginatedOrganizations.map(organization => (
								<OrganizationCard
									key={organization.id}
									organization={organization}
									onView={handleViewDetails}
									onApprove={handleApprove}
									onReject={handleRejectClick}
									isLoading={isLoading}
									formatDate={formatDate}
								/>
							))}
						</div>
						<ModerationPagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</>
				)}
			</div>

			<OrganizationDetailDrawer
				organization={selectedOrganization}
				open={isDetailOpen}
				onOpenChange={setIsDetailOpen}
				isLoading={isLoading}
				onApprove={handleApprove}
				onReject={handleRejectClick}
			/>

			<RejectDialog
				open={isRejectDialogOpen}
				onOpenChange={setIsRejectDialogOpen}
				organizationName={selectedOrganization?.name}
				reason={rejectReason}
				onReasonChange={setRejectReason}
				onConfirm={handleRejectConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
