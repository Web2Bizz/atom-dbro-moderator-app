import { Input } from '@/components/ui/input'

interface TableSearchProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

export function TableSearch({
	value,
	onChange,
	placeholder = 'Поиск по названию...',
	className,
}: TableSearchProps) {
	return (
		<Input
			placeholder={placeholder}
			value={value}
			onChange={e => onChange(e.target.value)}
			className={className}
		/>
	)
}

