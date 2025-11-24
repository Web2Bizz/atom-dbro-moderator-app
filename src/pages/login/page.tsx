'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true)
		try {
			// TODO: Реализовать логику авторизации
			console.log('Login data:', data)
			// await login(data.email, data.password)
		} catch (error) {
			console.error('Login error:', error)
		} finally {
			setIsLoading(false)
		}
	}

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

