import { useState } from 'react'
import { useApiQuery, useApiMutation } from '@shared/lib/hooks'
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
import type { Quest, CreateQuestDto, City } from '@shared/lib/api/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const questSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']),
  experienceReward: z.number().min(0),
  cityId: z.number().optional(),
})

type QuestFormData = z.infer<typeof questSchema>

export const QuestsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  const { data: cities = [] } = useApiQuery<City[]>(['cities'], '/cities')
  const { data: quests = [], isLoading } = useApiQuery<Quest[]>(
    ['quests'],
    '/quests'
  )

  const createMutation = useApiMutation<Quest, CreateQuestDto>({
    endpoint: '/quests',
    method: 'POST',
    invalidateQueries: [['quests']],
    onSuccess: () => {
      setIsCreateOpen(false)
      createForm.reset()
    },
  })

  const createForm = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
      experienceReward: 0,
      cityId: undefined,
    },
  })

  const editForm = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      title: editingQuest?.title || '',
      description: editingQuest?.description || '',
      status: editingQuest?.status || 'active',
      experienceReward: editingQuest?.experienceReward || 0,
      cityId: editingQuest?.cityId || undefined,
    },
  })

  const handleCreate = (data: QuestFormData) => {
    createMutation.mutate(data)
  }

  const handleEdit = async (data: QuestFormData) => {
    if (editingQuest) {
      setIsUpdating(true)
      try {
        await patch<Quest>(`/quests/${editingQuest.id}`, data)
        queryClient.invalidateQueries({ queryKey: ['quests'] })
        setEditingQuest(null)
        editForm.reset()
      } catch (error) {
        console.error('Ошибка при обновлении квеста:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleDelete = async (quest: Quest) => {
    if (confirm(`Удалить квест "${quest.title}"?`)) {
      try {
        await del<void>(`/quests/${quest.id}`)
        queryClient.invalidateQueries({ queryKey: ['quests'] })
      } catch (error) {
        console.error('Ошибка при удалении квеста:', error)
      }
    }
  }

  const handleEditClick = (quest: Quest) => {
    setEditingQuest(quest)
    editForm.reset({
      title: quest.title,
      description: quest.description || '',
      status: quest.status,
      experienceReward: quest.experienceReward,
      cityId: quest.cityId || undefined,
    })
  }

  const statusLabels = {
    active: 'Активный',
    completed: 'Завершен',
    archived: 'Архивирован',
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light">Квесты</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить квест
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать квест</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="space-y-4"
                >
                  <FormField
                    control={createForm.control}
                    name="title"
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
                  <FormField
                    control={createForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Статус</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите статус" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
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
                    name="experienceReward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Награда опыта</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
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
                          onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                          value={field.value?.toString() || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите город (необязательно)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Не указан</SelectItem>
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
                <TableHead>Статус</TableHead>
                <TableHead>Награда опыта</TableHead>
                <TableHead>Город</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Нет квестов
                  </TableCell>
                </TableRow>
              ) : (
                quests.map((quest) => (
                  <TableRow key={quest.id}>
                    <TableCell>{quest.id}</TableCell>
                    <TableCell>{quest.title}</TableCell>
                    <TableCell>{statusLabels[quest.status]}</TableCell>
                    <TableCell>{quest.experienceReward}</TableCell>
                    <TableCell>
                      {quest.city?.name || cities.find((c) => c.id === quest.cityId)?.name || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(quest)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(quest)}
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
        <Dialog open={!!editingQuest} onOpenChange={(open: boolean) => !open && setEditingQuest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать квест</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEdit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="title"
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
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Статус</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
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
                  name="experienceReward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Награда опыта</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
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
                        onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город (необязательно)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Не указан</SelectItem>
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
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingQuest(null)}
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

