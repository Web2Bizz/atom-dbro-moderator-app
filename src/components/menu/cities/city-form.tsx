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
import { type Region } from '../regions/types'
import { type City } from './types'

const cityFormSchema = z.object({
	name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
	latitude: z
		.number()
		.min(-90, 'Широта должна быть от -90 до 90')
		.max(90, 'Широта должна быть от -90 до 90'),
	longitude: z
		.number()
		.min(-180, 'Долгота должна быть от -180 до 180')
		.max(180, 'Долгота должна быть от -180 до 180'),
	regionId: z.number().min(1, 'Регион обязателен'),
})

type CityFormValues = z.infer<typeof cityFormSchema>

interface CityFormProps {
	city?: City
	regions: Region[]
	onSubmit: (data: CityFormValues) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function CityForm({
	city,
	regions,
	onSubmit,
	onCancel,
	isLoading = false,
}: CityFormProps) {
	const form = useForm<CityFormValues>({
		resolver: zodResolver(cityFormSchema),
		defaultValues: city
			? {
					name: city.name,
					latitude: city.latitude,
					longitude: city.longitude,
					regionId: city.regionId,
			  }
			: {
					name: '',
					latitude: 0,
					longitude: 0,
					regionId: 0,
			  },
	})

	const onSubmitHandler = (data: CityFormValues) => {
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
								Название города <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder='Введите название города' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='regionId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Регион <span className='text-destructive'>*</span>
							</FormLabel>
							<Select
								onValueChange={value => field.onChange(Number(value))}
								value={field.value ? String(field.value) : undefined}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Выберите регион' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{regions.map(region => (
										<SelectItem key={region.id} value={String(region.id)}>
											{region.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='latitude'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Широта <span className='text-destructive'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										type='number'
										placeholder='55.7558'
										step='0.0001'
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='longitude'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Долгота <span className='text-destructive'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										type='number'
										placeholder='37.6173'
										step='0.0001'
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
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
						{city ? 'Сохранить изменения' : 'Создать город'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
