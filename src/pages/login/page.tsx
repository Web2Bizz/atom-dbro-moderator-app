'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLoginMutation } from '@/store/entities'
import { saveRefreshToken, saveToken } from '@/utils/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
	email: z.string().email('Некорректный email адрес'),
	password: z.string().min(1, 'Пароль обязателен'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
	const { isAuthenticated, setIsAuthenticated, setUser } = useAuth()
	const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	// Если пользователь уже авторизован, перенаправляем на главную
	useEffect(() => {
		if (isAuthenticated) {
			globalThis.location.href = '/admin-panel/'
		}
	}, [isAuthenticated])

	if (isAuthenticated) {
		return null
	}

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const result = await loginMutation({
				email: data.email,
				password: data.password,
			})

			if (result.error) {
				const errorMessage =
					'data' in result.error &&
					result.error.data &&
					typeof result.error.data === 'object' &&
					'message' in result.error.data
						? String(result.error.data.message)
						: 'Ошибка входа. Проверьте правильность данных.'

				toast.error(errorMessage)
				return
			}

			if (!result.data) {
				toast.error('Ошибка входа. Попробуйте еще раз.')
				return
			}

			// Сохраняем токены
			if (result.data.access_token) {
				saveToken(result.data.access_token)
			}
			if (result.data.refresh_token) {
				saveRefreshToken(result.data.refresh_token)
			}

			// Сохраняем данные пользователя
			if (result.data.user) {
				setUser({
					id: result.data.user.id,
					email: result.data.user.email,
				})
			}

			// Устанавливаем статус авторизации
			setIsAuthenticated(true)

			toast.success('Успешный вход в систему')

			// Редирект произойдет автоматически через useEffect при изменении isAuthenticated
		} catch (error) {
			console.error('Login error:', error)
			toast.error('Произошла ошибка при входе')
		}
	}

	const isLoading = isLoggingIn

	return (
		<div className='absolute inset-0 flex items-center justify-center bg-background p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold'>Вход в систему</CardTitle>
					<CardDescription>
						Введите вашу почту и пароль для входа
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Почта</FormLabel>
										<FormControl>
											<Input
												type='email'
												placeholder='example@email.com'
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Пароль</FormLabel>
										<FormControl>
											<div className='relative'>
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder='Введите пароль'
													disabled={isLoading}
													className='pr-10'
													{...field}
												/>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
													onClick={() => setShowPassword(!showPassword)}
													disabled={isLoading}
												>
													{showPassword ? (
														<EyeOff className='h-4 w-4 text-muted-foreground' />
													) : (
														<Eye className='h-4 w-4 text-muted-foreground' />
													)}
													<span className='sr-only'>
														{showPassword ? 'Скрыть пароль' : 'Показать пароль'}
													</span>
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit' className='w-full' disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Вход...
									</>
								) : (
									'Войти'
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
