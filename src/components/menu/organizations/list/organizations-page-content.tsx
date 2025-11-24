'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { type City } from '../../cities/types'
import { OrganizationsTable } from './organizations-table'
import { OrganizationEditDrawer } from './components/organization-edit-drawer'
import { DeleteOrganizationDialog } from '../delete-organization-dialog'
import { OrganizationsHeader } from './components/organizations-header'
import {
	type Organization,
	type OrganizationFormData,
	type OrganizationType,
	type HelpType,
} from '../types'
import {
	mockOrganizations,
	mockCities,
	mockOrganizationTypes,
	mockHelpTypes,
} from './mock-data'

export function OrganizationsPageContent() {
	const [organizations, setOrganizations] = React.useState<Organization[]>(
		mockOrganizations
	)
	const [cities] = React.useState<City[]>(mockCities)
	const [organizationTypes] = React.useState<OrganizationType[]>(
		mockOrganizationTypes
	)
	const [helpTypes] = React.useState<HelpType[]>(mockHelpTypes)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingOrganization, setEditingOrganization] =
		React.useState<Organization | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [organizationToDelete, setOrganizationToDelete] =
		React.useState<Organization | null>(null)

	const handleEdit = (organization: Organization) => {
		setEditingOrganization(organization)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (organization: Organization) => {
		setOrganizationToDelete(organization)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!organizationToDelete) return

		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setOrganizations(prev =>
				prev.filter(org => org.id !== organizationToDelete.id)
			)
			toast.success('Организация успешно удалена')
			setDeleteDialogOpen(false)
			setOrganizationToDelete(null)
		} catch {
			toast.error('Ошибка при удалении организации')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: OrganizationFormData) => {
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			const selectedCity = cities.find(c => c.id === data.cityId)
			const selectedType = organizationTypes.find(t => t.id === data.typeId)
			const selectedHelpTypes = helpTypes.filter(ht =>
				data.helpTypeIds?.includes(ht.id)
			)

			if (!selectedCity || !selectedType) {
				toast.error('Ошибка: не найдены связанные данные')
				return
			}

			// Обновление существующей организации
			if (!editingOrganization) return

			const now = new Date().toISOString()
			setOrganizations(prev =>
				prev.map(org =>
					org.id === editingOrganization.id
						? {
								...data,
								id: editingOrganization.id,
								city: selectedCity,
								type: selectedType,
								helpTypes: selectedHelpTypes,
								createdAt: org.createdAt,
								updatedAt: now,
							}
						: org
				)
			)
			toast.success('Организация успешно обновлена')

			setIsDrawerOpen(false)
			setEditingOrganization(undefined)
		} catch {
			toast.error('Ошибка при обновлении организации')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingOrganization(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<OrganizationsHeader />

			<OrganizationEditDrawer
				open={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
				organization={editingOrganization}
				cities={cities}
				organizationTypes={organizationTypes}
				helpTypes={helpTypes}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				isLoading={isLoading}
			/>

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				<OrganizationsTable
					organizations={organizations}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
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

