import { useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Region, CreateRegionDto } from '@shared/lib/api/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const regionSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
})

type RegionFormData = z.infer<typeof regionSchema>

export const RegionsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: regions = [], isLoading } = useApiQuery<Region[]>(
    ['regions'],
    '/regions'
  )

  const createMutation = useApiMutation<Region, CreateRegionDto>({
    endpoint: '/regions',
    method: 'POST',
    invalidateQueries: [['regions']],
    onSuccess: () => {
      setIsCreateOpen(false)
      createForm.reset()
      toast({
        title: 'Успешно',
        description: 'Регион успешно создан',
      })
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать регион',
        variant: 'destructive',
      })
    },
  })


  const createForm = useForm<RegionFormData>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: '',
    },
  })

  const editForm = useForm<RegionFormData>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: editingRegion?.name || '',
    },
  })

  const handleCreate = (data: RegionFormData) => {
    createMutation.mutate(data)
  }

  const handleEdit = async (data: RegionFormData) => {
    if (editingRegion) {
      setIsUpdating(true)
      try {
        await patch<Region>(`/regions/${editingRegion.id}`, data)
        queryClient.invalidateQueries({ queryKey: ['regions'] })
        setEditingRegion(null)
        editForm.reset()
        toast({
          title: 'Успешно',
          description: 'Регион успешно обновлен',
        })
      } catch (error: unknown) {
        const apiError = error as { message?: string }
        toast({
          title: 'Ошибка',
          description: apiError.message || 'Не удалось обновить регион',
          variant: 'destructive',
        })
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleDelete = async (region: Region) => {
    if (confirm(`Удалить регион "${region.name}"?`)) {
      try {
        await del<void>(`/regions/${region.id}`)
        queryClient.invalidateQueries({ queryKey: ['regions'] })
        toast({
          title: 'Успешно',
          description: 'Регион успешно удален',
        })
      } catch (error: unknown) {
        const apiError = error as { message?: string }
        toast({
          title: 'Ошибка',
          description: apiError.message || 'Не удалось удалить регион',
          variant: 'destructive',
        })
      }
    }
  }

  const handleEditClick = (region: Region) => {
    setEditingRegion(region)
    editForm.reset({ name: region.name })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light">Регионы</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить регион
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать регион</DialogTitle>
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
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Нет регионов
                  </TableCell>
                </TableRow>
              ) : (
                regions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell>{region.id}</TableCell>
                    <TableCell>{region.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(region)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(region)}
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
        <Dialog open={!!editingRegion} onOpenChange={(open: boolean) => !open && setEditingRegion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать регион</DialogTitle>
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
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingRegion(null)}
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

