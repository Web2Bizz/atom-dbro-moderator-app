'use client'

import * as React from 'react'

import { toast } from 'sonner'

import { EmptyState } from './components/empty-state'
import { FiltersBar } from './components/filters-bar'
import { ModerationHeader } from './components/moderation-header'
import { ModerationPagination } from './components/moderation-pagination'
import { OrganizationCard } from './components/organization-card'
import { OrganizationDetailDrawer } from './components/organization-detail-drawer'
import { RejectDialog } from './components/reject-dialog'
import { mockPendingOrganizations } from './mock-data'

import { type Organization } from '@/components/menu/organizations/types'

export function ModerationPageContent() {
	const [organizations, setOrganizations] = React.useState<Organization[]>(
		mockPendingOrganizations
	)
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
		const citySet = new Set(organizations.map(org => org.city.name))
		return Array.from(citySet).sort(localeCollator.compare)
	}, [organizations, localeCollator])

	const organizationTypes = React.useMemo(() => {
		const typeSet = new Set(organizations.map(org => org.type.name))
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
			await new Promise(resolve => setTimeout(resolve, 1000))
			setOrganizations(prev => prev.filter(org => org.id !== organization.id))
			toast.success('Организация одобрена и опубликована')
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
			await new Promise(resolve => setTimeout(resolve, 1000))
			setOrganizations(prev =>
				prev.filter(org => org.id !== selectedOrganization.id)
			)
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
