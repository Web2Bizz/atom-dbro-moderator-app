'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm, type FieldArrayPath } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { type City } from '../cities/types'
import {
	type HelpType,
	type Organization,
	type OrganizationType,
} from './types'

const organizationFormSchema = z.object({
	name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
	latitude: z
		.number()
		.min(-90, 'Широта должна быть от -90 до 90')
		.max(90, 'Широта должна быть от -90 до 90'),
	longitude: z
		.number()
		.min(-180, 'Долгота должна быть от -180 до 180')
		.max(180, 'Долгота должна быть от -180 до 180'),
	summary: z
		.string()
		.min(10, 'Краткое описание должно содержать минимум 10 символов'),
	mission: z.string().min(10, 'Миссия должна содержать минимум 10 символов'),
	description: z
		.string()
		.min(10, 'Описание должно содержать минимум 10 символов'),
	goals: z
		.array(z.string().min(1, 'Цель не может быть пустой'))
		.min(1, 'Добавьте хотя бы одну цель'),
	needs: z
		.array(z.string().min(1, 'Потребность не может быть пустой'))
		.optional(),
	address: z.string().min(2, 'Адрес обязателен'),
	contacts: z
		.array(
			z.object({
				name: z.string().min(1, 'Название контакта обязательно'),
				value: z.string().min(1, 'Значение контакта обязательно'),
			})
		)
		.optional(),
	gallery: z.array(z.string().url('Некорректный URL')).optional(),
	cityId: z.number().min(1, 'Город обязателен'),
	typeId: z.number().min(1, 'Тип организации обязателен'),
	helpTypeIds: z.array(z.number()).optional(),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

interface OrganizationFormProps {
	readonly organization?: Organization
	readonly cities: City[]
	readonly organizationTypes: OrganizationType[]
	readonly helpTypes: HelpType[]
	readonly onSubmit: (data: OrganizationFormValues) => Promise<void> | void
	readonly onCancel: () => void
	readonly isLoading?: boolean
}

export function OrganizationForm({
	organization,
	cities,
	organizationTypes,
	helpTypes,
	onSubmit,
	onCancel,
	isLoading = false,
}: OrganizationFormProps) {
	const form = useForm<OrganizationFormValues>({
		resolver: zodResolver(organizationFormSchema),
		defaultValues: organization
			? {
					name: organization.name,
					latitude: organization.latitude,
					longitude: organization.longitude,
					summary: organization.summary,
					mission: organization.mission,
					description: organization.description,
					goals: organization.goals,
					needs: organization.needs || [],
					address: organization.address,
					contacts: organization.contacts || [],
					gallery: organization.gallery || [],
					cityId: organization.city.id,
					typeId: organization.type.id,
					helpTypeIds: organization.helpTypes.map(ht => ht.id),
			  }
			: {
					name: '',
					latitude: 0,
					longitude: 0,
					summary: '',
					mission: '',
					description: '',
					goals: [''],
					needs: [],
					address: '',
					contacts: [],
					gallery: [],
					cityId: 0,
					typeId: 0,
					helpTypeIds: [],
			  },
	})

	const goalsArray = useFieldArray({
		control: form.control,
		name: 'goals' as FieldArrayPath<OrganizationFormValues>,
	})
	const {
		fields: goalsFields,
		append: appendGoal,
		remove: removeGoal,
	} = goalsArray

	const needsArray = useFieldArray({
		control: form.control,
		name: 'needs' as FieldArrayPath<OrganizationFormValues>,
	})
	const {
		fields: needsFields,
		append: appendNeed,
		remove: removeNeed,
	} = needsArray

	const contactsArray = useFieldArray({
		control: form.control,
		name: 'contacts' as FieldArrayPath<OrganizationFormValues>,
	})
	const {
		fields: contactsFields,
		append: appendContact,
		remove: removeContact,
	} = contactsArray

	const galleryArray = useFieldArray({
		control: form.control,
		name: 'gallery' as FieldArrayPath<OrganizationFormValues>,
	})
	const {
		fields: galleryFields,
		append: appendGallery,
		remove: removeGallery,
	} = galleryArray

	const onSubmitHandler = (data: OrganizationFormValues) => {
		// Преобразуем OrganizationFormValues в OrganizationFormData
		const formData = {
			...data,
			needs: data.needs ?? [],
			contacts: data.contacts ?? [],
			gallery: data.gallery ?? [],
			helpTypeIds: data.helpTypeIds ?? [],
		}
		onSubmit(formData as unknown as Parameters<typeof onSubmit>[0])
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
								Название организации <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder='Введите название организации' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='cityId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Город <span className='text-destructive'>*</span>
								</FormLabel>
								<Select
									onValueChange={value => field.onChange(Number(value))}
									value={field.value ? String(field.value) : undefined}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Выберите город' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{cities.map(city => (
											<SelectItem key={city.id} value={String(city.id)}>
												{city.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='typeId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Тип организации <span className='text-destructive'>*</span>
								</FormLabel>
								<Select
									onValueChange={value => field.onChange(Number(value))}
									value={field.value ? String(field.value) : undefined}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Выберите тип' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{organizationTypes.map(type => (
											<SelectItem key={type.id} value={String(type.id)}>
												{type.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='address'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Адрес <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder='Введите адрес' {...field} />
							</FormControl>
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
										placeholder='52.5444'
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
										placeholder='103.8883'
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

				<FormField
					control={form.control}
					name='summary'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Краткое описание <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Введите краткое описание'
									rows={2}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='mission'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Миссия <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Введите миссию организации'
									rows={2}
									{...field}
								/>
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
									placeholder='Введите полное описание'
									rows={4}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='space-y-2'>
					<FormLabel>
						Цели <span className='text-destructive'>*</span>
					</FormLabel>
					{goalsFields.map((field, index) => (
						<FormField
							key={field.id}
							control={form.control}
							name={`goals.${index}`}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex gap-2'>
											<Input
												placeholder={`Цель ${index + 1}`}
												{...field}
												className='flex-1'
											/>
											{goalsFields.length > 1 && (
												<Button
													type='button'
													variant='outline'
													size='icon'
													onClick={() => removeGoal(index)}
												>
													<Trash2 className='size-4' />
												</Button>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() =>
							(appendGoal as unknown as (value: string) => void)('')
						}
						className='w-full'
					>
						<Plus className='mr-2 size-4' />
						Добавить цель
					</Button>
				</div>

				<div className='space-y-2'>
					<FormLabel>Потребности</FormLabel>
					{needsFields.map((field, index) => (
						<FormField
							key={field.id}
							control={form.control}
							name={`needs.${index}`}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex gap-2'>
											<Input
												placeholder={`Потребность ${index + 1}`}
												{...field}
												className='flex-1'
											/>
											<Button
												type='button'
												variant='outline'
												size='icon'
												onClick={() => removeNeed(index)}
											>
												<Trash2 className='size-4' />
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() =>
							(appendNeed as unknown as (value: string) => void)('')
						}
						className='w-full'
					>
						<Plus className='mr-2 size-4' />
						Добавить потребность
					</Button>
				</div>

				<div className='space-y-2'>
					<FormLabel>Контакты</FormLabel>
					{contactsFields.map((field, index) => (
						<div key={field.id} className='grid grid-cols-2 gap-2'>
							<FormField
								control={form.control}
								name={`contacts.${index}.name`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder='Название' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex gap-2'>
								<FormField
									control={form.control}
									name={`contacts.${index}.value`}
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormControl>
												<Input placeholder='Значение' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type='button'
									variant='outline'
									size='icon'
									onClick={() => removeContact(index)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						</div>
					))}
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => appendContact({ name: '', value: '' })}
						className='w-full'
					>
						<Plus className='mr-2 size-4' />
						Добавить контакт
					</Button>
				</div>

				<div className='space-y-2'>
					<FormLabel>Галерея (URL изображений)</FormLabel>
					{galleryFields.map((field, index) => (
						<FormField
							key={field.id}
							control={form.control}
							name={`gallery.${index}`}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex gap-2'>
											<Input
												type='url'
												placeholder='https://example.com/image.jpg'
												{...field}
												className='flex-1'
											/>
											<Button
												type='button'
												variant='outline'
												size='icon'
												onClick={() => removeGallery(index)}
											>
												<Trash2 className='size-4' />
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() =>
							(appendGallery as unknown as (value: string) => void)('')
						}
						className='w-full'
					>
						<Plus className='mr-2 size-4' />
						Добавить изображение
					</Button>
				</div>

				<FormField
					control={form.control}
					name='helpTypeIds'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Виды помощи</FormLabel>
							<div className='space-y-3 rounded-md border p-4'>
								{helpTypes.map(helpType => {
									const isChecked = field.value?.includes(helpType.id) || false
									return (
										<FormItem
											key={helpType.id}
											className='flex flex-row items-start space-x-3 space-y-0'
										>
											<FormControl>
												<Checkbox
													checked={isChecked}
													onCheckedChange={checked => {
														const currentIds = field.value || []
														if (checked) {
															field.onChange([...currentIds, helpType.id])
														} else {
															field.onChange(
																currentIds.filter(id => id !== helpType.id)
															)
														}
													}}
												/>
											</FormControl>
											<FormLabel className='font-normal cursor-pointer'>
												{helpType.name}
											</FormLabel>
										</FormItem>
									)
								})}
							</div>
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
						{organization ? 'Сохранить изменения' : 'Создать организацию'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
