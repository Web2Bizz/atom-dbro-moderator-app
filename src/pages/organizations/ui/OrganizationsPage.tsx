import { useState, useEffect, useMemo } from 'react'
import { useApiQuery, useApiMutation, useToast } from '@shared/lib/hooks'
import { patch, del } from '@shared/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import { Layout } from '@widgets/layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/ui/table'
import { Button } from '@shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Organization, CreateOrganizationDto, City, OrganizationType } from '@shared/lib/api/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const organizationSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  organizationTypeId: z.number().min(1, 'Тип организации обязателен'),
  cityId: z.number().min(1, 'Город обязателен'),
  address: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
})

type OrganizationFormData = z.infer<typeof organizationSchema>

export const OrganizationsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: cities = [] } = useApiQuery<City[]>(['cities'], '/cities')
  const { data: organizationTypesRaw } = useApiQuery<OrganizationType[] | { type: OrganizationType[] }>(
    ['organization-types'],
    '/organization-types'
  )
  
  // Обрабатываем разные форматы ответа API
  // API может возвращать либо массив напрямую, либо объект с полем type
  const organizationTypes = useMemo(() => {
    if (!organizationTypesRaw) return []
    if (Array.isArray(organizationTypesRaw)) {
      return organizationTypesRaw
    }
    // Если это объект с полем type
    if (typeof organizationTypesRaw === 'object' && 'type' in organizationTypesRaw) {
      return Array.isArray(organizationTypesRaw.type) ? organizationTypesRaw.type : []
    }
    return []
  }, [organizationTypesRaw])
  
  const { data: organizations = [], isLoading } = useApiQuery<Organization[]>(
    ['organizations'],
    '/organizations'
  )

  const createMutation = useApiMutation<Organization, CreateOrganizationDto>({
    endpoint: '/organizations',
    method: 'POST',
    invalidateQueries: [['organizations']],
    onSuccess: () => {
      setIsCreateOpen(false)
      createForm.reset()
      toast({
        title: 'Успешно',
        description: 'Организация успешно создана',
      })
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать организацию',
        variant: 'destructive',
      })
    },
  })

  const createForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      organizationTypeId: undefined,
      cityId: undefined,
      address: '',
      summary: '',
      description: '',
    },
  })

  const editForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      organizationTypeId: undefined,
      cityId: undefined,
      address: '',
      summary: '',
      description: '',
    },
  })

  // Логирование для отладки
  useEffect(() => {
    if (organizations.length > 0) {
      console.log('[OrganizationsPage] Organizations:', organizations.map(org => ({
        id: org.id,
        name: org.name,
        organizationTypeId: org.organizationTypeId,
        organizationType: org.organizationType,
      })))
    }
  }, [organizations])

  useEffect(() => {
    console.log('[OrganizationsPage] Raw organizationTypesRaw:', organizationTypesRaw)
    console.log('[OrganizationsPage] Processed organizationTypes:', organizationTypes)
    if (organizationTypes.length > 0) {
      console.log('[OrganizationsPage] Organization types structure:', JSON.stringify(organizationTypes, null, 2))
    } else {
      console.log('[OrganizationsPage] Organization types is empty or not loaded')
    }
  }, [organizationTypesRaw, organizationTypes])

  // Обновляем форму при изменении редактируемой организации
  // Также обновляем, когда загружаются типы организаций и города
  useEffect(() => {
    if (editingOrganization && organizationTypes.length > 0 && cities.length > 0) {
      const formData = {
        name: editingOrganization.name || '',
        organizationTypeId: editingOrganization.organizationTypeId,
        cityId: editingOrganization.cityId,
        address: editingOrganization.address || '',
        summary: editingOrganization.summary || '',
        description: editingOrganization.description || '',
      }
      console.log('[OrganizationsPage] Resetting form with data:', formData)
      console.log('[OrganizationsPage] Available organizationTypes:', organizationTypes.length)
      console.log('[OrganizationsPage] Available cities:', cities.length)
      editForm.reset(formData)
    } else if (!editingOrganization) {
      // Сбрасываем форму, если организация не выбрана
      editForm.reset({
        name: '',
        organizationTypeId: undefined,
        cityId: undefined,
        address: '',
        summary: '',
        description: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingOrganization, organizationTypes, cities])

  const handleCreate = (data: OrganizationFormData) => {
    createMutation.mutate(data)
  }

  const handleEdit = async (data: OrganizationFormData) => {
    if (editingOrganization) {
      setIsUpdating(true)
      try {
        // Отправляем все поля формы
        const updateData = {
          name: data.name,
          organizationTypeId: data.organizationTypeId,
          cityId: data.cityId,
          address: data.address || undefined,
          summary: data.summary || undefined,
          description: data.description || undefined,
        }

        console.log('[OrganizationsPage] Updating organization:', {
          id: editingOrganization.id,
          data: updateData,
        })

        await patch<Organization>(`/organizations/${editingOrganization.id}`, updateData)
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
        setEditingOrganization(null)
        editForm.reset()
        toast({
          title: 'Успешно',
          description: 'Организация успешно обновлена',
        })
      } catch (error: unknown) {
        const apiError = error as { message?: string }
        console.error('Ошибка при обновлении организации:', error)
        toast({
          title: 'Ошибка',
          description: apiError.message || 'Не удалось обновить организацию',
          variant: 'destructive',
        })
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleDelete = async (organization: Organization) => {
    if (confirm(`Удалить организацию "${organization.name}"?`)) {
      try {
        await del<void>(`/organizations/${organization.id}`)
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
        toast({
          title: 'Успешно',
          description: 'Организация успешно удалена',
        })
      } catch (error: unknown) {
        const apiError = error as { message?: string }
        console.error('Ошибка при удалении организации:', error)
        toast({
          title: 'Ошибка',
          description: apiError.message || 'Не удалось удалить организацию',
          variant: 'destructive',
        })
      }
    }
  }

  const handleEditClick = (organization: Organization) => {
    console.log('[OrganizationsPage] Editing organization:', organization)
    setEditingOrganization(organization)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light">Организации</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить организацию
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать организацию</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="space-y-4"
                >
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="organizationTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип организации</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип организации" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizationTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Город</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите город" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
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
                    control={createForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Адрес</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Краткое описание</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                    >
                      Создать
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Загрузка...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип организации</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Нет организаций
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell>{organization.id}</TableCell>
                    <TableCell>{organization.name}</TableCell>
                    <TableCell>
                      {(() => {
                        console.log('[OrganizationsPage] Rendering organization type for org:', {
                          id: organization.id,
                          organizationTypeId: organization.organizationTypeId,
                          organizationType: organization.organizationType,
                          organizationTypesCount: organizationTypes.length,
                        })
                        // Сначала проверяем, есть ли тип в объекте организации
                        if (organization.organizationType?.name) {
                          console.log('[OrganizationsPage] Found type in organization object:', organization.organizationType.name)
                          return organization.organizationType.name
                        }
                        // Затем ищем в загруженных типах
                        if (organizationTypes.length > 0 && organization.organizationTypeId) {
                          const type = organizationTypes.find((t) => t.id === organization.organizationTypeId)
                          console.log('[OrganizationsPage] Found type in organizationTypes array:', type)
                          if (type?.name) {
                            return type.name
                          }
                        }
                        // Если ничего не найдено, показываем ID
                        console.log('[OrganizationsPage] Type not found, showing ID:', organization.organizationTypeId)
                        return organization.organizationTypeId || '-'
                      })()}
                    </TableCell>
                    <TableCell>
                      {organization.city?.name || cities.find((c) => c.id === organization.cityId)?.name || organization.cityId}
                    </TableCell>
                    <TableCell>{organization.address || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(organization)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(organization)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingOrganization} onOpenChange={(open: boolean) => !open && setEditingOrganization(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Редактировать организацию</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEdit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="organizationTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип организации</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          console.log('[OrganizationsPage] Organization type changed:', value)
                          field.onChange(Number(value))
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип организации" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Город</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          console.log('[OrganizationsPage] City changed:', value)
                          field.onChange(Number(value))
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
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
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Краткое описание</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingOrganization(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

