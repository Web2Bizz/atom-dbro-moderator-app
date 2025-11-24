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
import { type HelpType } from './types'

const helpTypeFormSchema = z.object({
	name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
})

type HelpTypeFormValues = z.infer<typeof helpTypeFormSchema>

interface HelpTypeFormProps {
	helpType?: HelpType
	onSubmit: (data: HelpTypeFormValues) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function HelpTypeForm({
	helpType,
	onSubmit,
	onCancel,
	isLoading = false,
}: HelpTypeFormProps) {
	const form = useForm<HelpTypeFormValues>({
		resolver: zodResolver(helpTypeFormSchema),
		defaultValues: helpType
			? {
					name: helpType.name,
			  }
			: {
					name: '',
			  },
	})

	const onSubmitHandler = (data: HelpTypeFormValues) => {
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
								Название вида помощи <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Введите название вида помощи'
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
						{helpType ? 'Сохранить изменения' : 'Создать вид помощи'}
					</Button>
				</div>
			</form>
		</Form>
	)
}

