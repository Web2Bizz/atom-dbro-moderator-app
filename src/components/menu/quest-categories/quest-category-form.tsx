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
import { type QuestCategory } from './types'

const questCategoryFormSchema = z.object({
	name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
})

type QuestCategoryFormValues = z.infer<typeof questCategoryFormSchema>

interface QuestCategoryFormProps {
	questCategory?: QuestCategory
	onSubmit: (data: QuestCategoryFormValues) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function QuestCategoryForm({
	questCategory,
	onSubmit,
	onCancel,
	isLoading = false,
}: QuestCategoryFormProps) {
	const form = useForm<QuestCategoryFormValues>({
		resolver: zodResolver(questCategoryFormSchema),
		defaultValues: questCategory
			? {
					name: questCategory.name,
			  }
			: {
					name: '',
			  },
	})

	const onSubmitHandler = (data: QuestCategoryFormValues) => {
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
								Название категории квеста{' '}
								<span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Введите название категории квеста'
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
						{questCategory
							? 'Сохранить изменения'
							: 'Создать категорию квеста'}
					</Button>
				</div>
			</form>
		</Form>
	)
}

