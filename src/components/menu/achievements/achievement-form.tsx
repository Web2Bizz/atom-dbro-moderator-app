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
import { type Achievement } from './types'

const achievementFormSchema = z.object({
	title: z.string().min(2, 'Название должно содержать минимум 2 символа'),
	description: z.string().min(1, 'Описание обязательно'),
	icon: z.string().min(1, 'Иконка обязательна'),
	rarity: z.string().min(1, 'Редкость обязательна'),
})

type AchievementFormValues = z.infer<typeof achievementFormSchema>

interface AchievementFormProps {
	achievement?: Achievement
	onSubmit: (data: AchievementFormValues) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

const rarityOptions = [
	{ value: 'private', label: 'Приватное' },
	{ value: 'common', label: 'Обычное' },
	{ value: 'rare', label: 'Редкое' },
	{ value: 'epic', label: 'Эпическое' },
	{ value: 'legendary', label: 'Легендарное' },
]

export function AchievementForm({
	achievement,
	onSubmit,
	onCancel,
	isLoading = false,
}: AchievementFormProps) {
	const form = useForm<AchievementFormValues>({
		resolver: zodResolver(achievementFormSchema),
		defaultValues: achievement
			? {
					title: achievement.title,
					description: achievement.description,
					icon: achievement.icon,
					rarity: achievement.rarity,
			  }
			: {
					title: '',
					description: '',
					icon: '🏆',
					rarity: 'common',
			  },
	})

	const onSubmitHandler = (data: AchievementFormValues) => {
		onSubmit(data)
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
								Название <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder='Введите название достижения' {...field} />
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
									placeholder='Введите описание достижения'
									className='min-h-[100px]'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='icon'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Иконка (эмодзи) <span className='text-destructive'>*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder='🏆' maxLength={2} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='rarity'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Редкость <span className='text-destructive'>*</span>
								</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Выберите редкость' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{rarityOptions.map(option => (
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
				</div>

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
						{achievement ? 'Сохранить изменения' : 'Создать достижение'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
