'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type OrganizationType } from './types'

const organizationTypeFormSchema = z.object({
	name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
})

type OrganizationTypeFormValues = z.infer<typeof organizationTypeFormSchema>

interface OrganizationTypeFormProps {
	organizationType?: OrganizationType
	onSubmit: (data: OrganizationTypeFormValues) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function OrganizationTypeForm({
	organizationType,
	onSubmit,
	onCancel,
	isLoading = false,
}: OrganizationTypeFormProps) {
	const form = useForm<OrganizationTypeFormValues>({
		resolver: zodResolver(organizationTypeFormSchema),
		defaultValues: organizationType
			? {
					name: organizationType.name,
			  }
			: {
					name: '',
			  },
	})

	const onSubmitHandler = (data: OrganizationTypeFormValues) => {
		onSubmit(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Название типа организации{' '}
								<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Введите название типа организации'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end'>
					<Button
						type='button'
						variant='outline'
						onClick={onCancel}
						className='w-full sm:w-auto'
					>
						Отмена
					</Button>
					<Button
						type='submit'
						disabled={isLoading}
						className='w-full sm:w-auto'
					>
						{isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
						{organizationType
							? 'Сохранить изменения'
							: 'Создать тип организации'}
					</Button>
				</div>
			</form>
		</Form>
	)
}

