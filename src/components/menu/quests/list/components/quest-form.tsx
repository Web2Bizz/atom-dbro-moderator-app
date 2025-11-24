'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm, type FieldArrayPath } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { type Quest, type QuestFormData } from '../../types'
import { type QuestCategory } from '../../../quest-categories/types'
import { type City } from '../../../cities/types'
import { type OrganizationType } from '../../../organizations/types'

const questFormSchema = z.object({
	title: z.string().min(2, 'Название должно содержать минимум 2 символа'),
	description: z.string().min(1, 'Описание обязательно'),
	status: z.string().optional(),
	experienceReward: z.number().min(0, 'Награда опытом должна быть неотрицательной').optional(),
	achievementId: z.number().nullable().optional(),
	ownerId: z.number().min(1, 'Владелец обязателен'),
	cityId: z.number().min(1, 'Город обязателен'),
	organizationTypeId: z.number().min(1, 'Тип организации обязателен'),
	latitude: z.string().optional(),
	longitude: z.string().optional(),
	address: z.string().optional(),
	contacts: z
		.array(
			z.object({
				name: z.string().min(1, 'Название контакта обязательно'),
				value: z.string().min(1, 'Значение контакта обязательно'),
			})
		)
		.optional(),
	coverImage: z.string().url('Некорректный URL').nullable().optional(),
	gallery: z.array(z.string().url('Некорректный URL')).optional(),
	steps: z
		.array(
			z.object({
				title: z.string().min(1, 'Название шага обязательно'),
				status: z.string().optional(),
				progress: z.number().min(0).max(100).optional(),
				description: z.string().optional(),
			})
		)
		.optional(),
	categoryIds: z.array(z.number()).min(1, 'Выберите хотя бы одну категорию'),
})

type QuestFormValues = z.infer<typeof questFormSchema>

interface QuestFormProps {
	quest?: Quest
	questCategories: QuestCategory[]
	cities?: City[]
	organizationTypes?: OrganizationType[]
	onSubmit: (data: QuestFormData) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function QuestForm({
	quest,
	questCategories,
	cities = [],
	organizationTypes = [],
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
					status: quest.status || '',
					experienceReward: quest.experienceReward || 0,
					achievementId: quest.achievementId || null,
					ownerId: quest.ownerId || 0,
					cityId: quest.cityId || 0,
					organizationTypeId: quest.organizationTypeId || 0,
					latitude: quest.latitude || '',
					longitude: quest.longitude || '',
					address: quest.address || '',
					contacts: quest.contacts || [],
					coverImage: quest.coverImage || null,
					gallery: quest.gallery || [],
					steps: quest.steps || [],
					categoryIds: quest.categories?.map(c => c.id) || [],
			  }
			: {
					title: '',
					description: '',
					status: '',
					experienceReward: 0,
					achievementId: null,
					ownerId: 0,
					cityId: 0,
					organizationTypeId: 0,
					latitude: '',
					longitude: '',
					address: '',
					contacts: [],
					coverImage: null,
					gallery: [],
					steps: [],
					categoryIds: [],
			  },
	})

	const {
		fields: contactFields,
		append: appendContact,
		remove: removeContact,
	} = useFieldArray({
		control: form.control,
		name: 'contacts' as FieldArrayPath<QuestFormValues>,
	})

	const {
		fields: galleryFields,
		append: appendGallery,
		remove: removeGallery,
	} = useFieldArray({
		control: form.control,
		name: 'gallery' as FieldArrayPath<QuestFormValues>,
	})

	const handleAppendGallery = () => {
		;(appendGallery as unknown as (value: string, options?: { shouldFocus?: boolean }) => void)('', { shouldFocus: false })
	}

	const {
		fields: stepFields,
		append: appendStep,
		remove: removeStep,
	} = useFieldArray({
		control: form.control,
		name: 'steps' as FieldArrayPath<QuestFormValues>,
	})

	const onSubmitHandler = (data: QuestFormValues) => {
		onSubmit({
			title: data.title,
			description: data.description,
			status: data.status || 'active',
			experienceReward: data.experienceReward || 0,
			achievementId: data.achievementId || null,
			ownerId: data.ownerId,
			cityId: data.cityId,
			organizationTypeId: data.organizationTypeId,
			latitude: data.latitude || '',
			longitude: data.longitude || '',
			address: data.address || '',
			contacts: data.contacts || [],
			coverImage: data.coverImage || null,
			gallery: data.gallery || [],
			steps: (data.steps || []).map(step => ({
				title: step.title,
				status: step.status || 'pending',
				progress: step.progress || 0,
				description: step.description || '',
			})),
			categoryIds: data.categoryIds,
		})
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

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='status'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Статус</FormLabel>
								<FormControl>
									<Input
										placeholder='Введите статус (необязательно)'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='experienceReward'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Награда опытом</FormLabel>
								<FormControl>
									<Input
										type='number'
										placeholder='0'
										{...field}
										onChange={e =>
											field.onChange(
												e.target.value ? Number(e.target.value) : 0
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					{cities.length > 0 && (
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
					)}

					{organizationTypes.length > 0 && (
						<FormField
							control={form.control}
							name='organizationTypeId'
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
												<SelectValue placeholder='Выберите тип организации' />
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
					)}
				</div>

				<FormField
					control={form.control}
					name='categoryIds'
					render={() => (
						<FormItem>
							<FormLabel>
								Категории <span className='text-destructive'>*</span>
							</FormLabel>
							<div className='space-y-2'>
								{questCategories.map(category => (
									<FormField
										key={category.id}
										control={form.control}
										name='categoryIds'
										render={({ field }) => {
											return (
												<FormItem
													key={category.id}
													className='flex flex-row items-start space-x-3 space-y-0'
												>
													<FormControl>
														<input
															type='checkbox'
															checked={field.value?.includes(category.id)}
															onChange={checked => {
																return checked.target.checked
																	? field.onChange([
																			...(field.value || []),
																			category.id,
																	  ])
																	: field.onChange(
																			field.value?.filter(
																				value => value !== category.id
																			)
																	  )
															}}
															className='mt-1'
														/>
													</FormControl>
													<FormLabel className='font-normal'>
														{category.name}
													</FormLabel>
												</FormItem>
											)
										}}
									/>
								))}
							</div>
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
								<FormLabel>Широта</FormLabel>
								<FormControl>
									<Input placeholder='54.22400050' {...field} />
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
								<FormLabel>Долгота</FormLabel>
								<FormControl>
									<Input placeholder='49.59503174' {...field} />
								</FormControl>
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
							<FormLabel>Адрес</FormLabel>
							<FormControl>
								<Input placeholder='Введите адрес' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='coverImage'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Обложка (URL)</FormLabel>
							<FormControl>
								<Input
									placeholder='https://example.com/image.jpg'
									{...field}
									value={field.value || ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<FormLabel>Контакты</FormLabel>
					<div className='space-y-2 mt-2'>
						{contactFields.map((field, index) => (
							<div key={field.id} className='flex gap-2'>
								<FormField
									control={form.control}
									name={`contacts.${index}.name` as const}
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormControl>
												<Input placeholder='Название' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`contacts.${index}.value` as const}
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
									variant='ghost'
									size='icon'
									onClick={() => removeContact(index)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						))}
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => appendContact({ name: '', value: '' })}
						>
							<Plus className='mr-2 size-4' />
							Добавить контакт
						</Button>
					</div>
				</div>

				<div>
					<FormLabel>Галерея (URL)</FormLabel>
					<div className='space-y-2 mt-2'>
						{galleryFields.map((field, index) => (
							<div key={field.id} className='flex gap-2'>
								<FormField
									control={form.control}
									name={`gallery.${index}` as const}
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormControl>
												<Input placeholder='https://example.com/image.jpg' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									onClick={() => removeGallery(index)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						))}
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={handleAppendGallery}
						>
							<Plus className='mr-2 size-4' />
							Добавить изображение
						</Button>
					</div>
				</div>

				<div>
					<FormLabel>Шаги квеста</FormLabel>
					<div className='space-y-2 mt-2'>
						{stepFields.map((field, index) => (
							<div key={field.id} className='border rounded-md p-3 space-y-2'>
								<div className='flex gap-2'>
									<FormField
										control={form.control}
										name={`steps.${index}.title` as const}
										render={({ field }) => (
											<FormItem className='flex-1'>
												<FormControl>
													<Input placeholder='Название шага' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										onClick={() => removeStep(index)}
									>
										<Trash2 className='size-4' />
									</Button>
								</div>
								<FormField
									control={form.control}
									name={`steps.${index}.description` as const}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Textarea
													placeholder='Описание шага'
													className='min-h-[60px]'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='grid grid-cols-2 gap-2'>
									<FormField
										control={form.control}
										name={`steps.${index}.status` as const}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input placeholder='Статус' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`steps.${index}.progress` as const}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														type='number'
														placeholder='Прогресс (0-100)'
														min={0}
														max={100}
														{...field}
														onChange={e =>
															field.onChange(
																e.target.value
																	? Number(e.target.value)
																	: 0
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						))}
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() =>
								appendStep({
									title: '',
									status: 'pending',
									progress: 0,
									description: '',
								})
							}
						>
							<Plus className='mr-2 size-4' />
							Добавить шаг
						</Button>
					</div>
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
						{quest ? 'Сохранить изменения' : 'Создать квест'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
