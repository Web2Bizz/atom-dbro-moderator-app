import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface TableSearchProps {
	value: string
	onChange: (value: string) => void
	className?: string
}

export function TableSearch({ value, onChange, className }: TableSearchProps) {
	return (
		<div className={`relative ${className || ''}`}>
			<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
			<Input
				placeholder='Поиск по названию...'
				value={value}
				onChange={e => onChange(e.target.value)}
				className='pl-9'
			/>
		</div>
	)
}

