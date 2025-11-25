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
import { type User } from './types'

const userFormSchema = z.object({
	firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
	middleName: z.string().optional(),
	email: z.string().email('Некорректный email адрес'),
	role: z.string().min(1, 'Роль обязательна'),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
	readonly user?: User
	readonly onSubmit: (data: UserFormValues) => Promise<void> | void
	readonly onCancel: () => void
	readonly isLoading?: boolean
}

export function UserForm({
	user,
	onSubmit,
	onCancel,
	isLoading = false,
}: UserFormProps) {
	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: user
			? {
					firstName: user.firstName,
					lastName: user.lastName,
					middleName: user.middleName,
					email: user.email,
					role: user.role,
			  }
			: {
					firstName: '',
					lastName: '',
					middleName: '',
					email: '',
					role: 'пользователь',
			  },
	})

	const onSubmitHandler = (data: UserFormValues) => {
		onSubmit(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-4'>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Имя <span className='text-destructive'>*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder='Введите имя' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='lastName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Фамилия <span className='text-destructive'>*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder='Введите фамилию' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='middleName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Отчество</FormLabel>
							<FormControl>
								<Input placeholder='Введите отчество' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Email <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='example@email.com'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='role'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Роль <span className='text-destructive'>*</span>
							</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Выберите роль' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='пользователь'>Пользователь</SelectItem>
									<SelectItem value='администратор'>Администратор</SelectItem>
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
						{user ? 'Сохранить изменения' : 'Создать пользователя'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
