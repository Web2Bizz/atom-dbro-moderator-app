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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type Quest, type QuestFormData } from '../../types'

const questFormSchema = z.object({
	title: z.string().min(2, 'Название должно содержать минимум 2 символа'),
	description: z.string().min(1, 'Описание обязательно'),
	status: z.enum(['active', 'archived', 'completed'], {
		required_error: 'Выберите статус',
	}),
})

type QuestFormValues = z.infer<typeof questFormSchema>

interface QuestFormProps {
	readonly quest?: Quest
	readonly questCategories?: QuestCategory[]
	readonly cities?: City[]
	readonly organizationTypes?: OrganizationType[]
	readonly onSubmit: (data: QuestFormData) => Promise<void> | void
	readonly onCancel: () => void
	readonly isLoading?: boolean
}

const statusOptions = [
	{ value: 'active', label: 'Активный' },
	{ value: 'archived', label: 'Архивированный' },
	{ value: 'completed', label: 'Завершенный' },
]

export function QuestForm({
	quest,
	onSubmit,
	onCancel,
	isLoading = false,
}: QuestFormProps) {
	const form = useForm<QuestFormValues>({
		resolver: zodResolver(questFormSchema),
		defaultValues: quest
			? {
					title: quest.title,
					description: quest.description,
					status:
						(quest.status as 'active' | 'archived' | 'completed') || 'active',
			  }
			: {
					title: '',
					description: '',
					status: 'active',
			  },
	})

	const onSubmitHandler = (data: QuestFormValues) => {
		onSubmit({
			title: data.title,
			description: data.description,
			status: data.status,
		} as QuestFormData)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-4'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Название квеста <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder='Введите название квеста' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Описание <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Введите описание квеста'
									className='min-h-[100px]'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Статус <span className='text-destructive'>*</span>
							</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Выберите статус' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{statusOptions.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
						{quest ? 'Сохранить изменения' : 'Создать квест'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
