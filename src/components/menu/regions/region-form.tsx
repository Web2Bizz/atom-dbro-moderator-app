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
import { type Region } from './types'

const regionFormSchema = z.object({
	name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
})

type RegionFormValues = z.infer<typeof regionFormSchema>

interface RegionFormProps {
	region?: Region
	onSubmit: (data: RegionFormValues) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function RegionForm({
	region,
	onSubmit,
	onCancel,
	isLoading = false,
}: RegionFormProps) {
	const form = useForm<RegionFormValues>({
		resolver: zodResolver(regionFormSchema),
		defaultValues: region
			? {
					name: region.name,
			  }
			: {
					name: '',
			  },
	})

	const onSubmitHandler = (data: RegionFormValues) => {
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
								Название региона <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder='Введите название региона' {...field} />
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
						{region ? 'Сохранить изменения' : 'Создать регион'}
					</Button>
				</div>
			</form>
		</Form>
	)
}

