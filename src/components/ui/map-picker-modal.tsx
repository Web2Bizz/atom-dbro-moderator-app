'use client'

import type { LatLngExpression, LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Loader2, MapPin } from 'lucide-react'
import * as React from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Импортируем иконки маркера для Leaflet
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

// Настройка иконки маркера по умолчанию
const DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapPickerModalProps {
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly latitude: number
	readonly longitude: number
	readonly onSelect: (latitude: number, longitude: number) => void
}

// Компонент для обработки кликов на карте
function MapClickHandler({
	onMapClick,
}: {
	readonly onMapClick: (lat: number, lng: number) => void
}) {
	useMapEvents({
		click: (e: LeafletMouseEvent) => {
			onMapClick(e.latlng.lat, e.latlng.lng)
		},
	})
	return null
}

// Компонент маркера с обработкой перетаскивания
function DraggableMarker({
	position,
	onPositionChange,
}: {
	readonly position: LatLngExpression
	readonly onPositionChange: (lat: number, lng: number) => void
}) {
	const markerRef = React.useRef<L.Marker>(null)

	const eventHandlers = React.useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current
				if (marker != null) {
					const latlng = marker.getLatLng()
					onPositionChange(latlng.lat, latlng.lng)
				}
			},
		}),
		[onPositionChange]
	)

	return (
		<Marker
			ref={markerRef}
			position={position}
			draggable={true}
			eventHandlers={eventHandlers}
		/>
	)
}

export function MapPickerModal({
	open,
	onOpenChange,
	latitude,
	longitude,
	onSelect,
}: MapPickerModalProps) {
	const [searchQuery, setSearchQuery] = React.useState('')
	const [isSearching, setIsSearching] = React.useState(false)
	const [selectedLat, setSelectedLat] = React.useState(latitude || 55.7558)
	const [selectedLng, setSelectedLng] = React.useState(longitude || 37.6173)
	const [markerPosition, setMarkerPosition] = React.useState<LatLngExpression>([
		selectedLat,
		selectedLng,
	])

	// Инициализация координат при открытии
	React.useEffect(() => {
		if (open) {
			const lat = latitude || 55.7558
			const lng = longitude || 37.6173
			setSelectedLat(lat)
			setSelectedLng(lng)
			setMarkerPosition([lat, lng])
		}
	}, [open, latitude, longitude])

	// Обновление позиции маркера при изменении координат
	React.useEffect(() => {
		setMarkerPosition([selectedLat, selectedLng])
	}, [selectedLat, selectedLng])

	const handleMapClick = (lat: number, lng: number) => {
		setSelectedLat(lat)
		setSelectedLng(lng)
		setMarkerPosition([lat, lng])
	}

	const handleSearch = async () => {
		if (!searchQuery.trim()) return

		setIsSearching(true)
		try {
			// Используем Nominatim (OpenStreetMap) для геокодирования
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					searchQuery
				)}&limit=1`
			)
			const data = await response.json()

			if (data && data.length > 0) {
				const lat = Number.parseFloat(data[0].lat)
				const lng = Number.parseFloat(data[0].lon)
				setSelectedLat(lat)
				setSelectedLng(lng)
				setMarkerPosition([lat, lng])
			}
		} catch (error) {
			console.error('Ошибка геокодирования:', error)
		} finally {
			setIsSearching(false)
		}
	}

	const handleConfirm = () => {
		onSelect(selectedLat, selectedLng)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-4xl w-full h-[90vh] flex flex-col'>
				<DialogHeader>
					<DialogTitle>Выберите точку на карте</DialogTitle>
					<DialogDescription>
						Кликните на карте или используйте поиск для выбора координат
					</DialogDescription>
				</DialogHeader>

				<div className='flex-1 flex flex-col gap-4 min-h-0'>
					<div className='flex gap-2'>
						<Input
							placeholder='Поиск по адресу...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleSearch()
								}
							}}
							className='flex-1'
						/>
						<Button type='button' onClick={handleSearch} disabled={isSearching}>
							{isSearching ? (
								<Loader2 className='mr-2 size-4 animate-spin' />
							) : (
								<MapPin className='mr-2 size-4' />
							)}
							Найти
						</Button>
					</div>

					<div className='flex-1 relative border rounded-lg overflow-hidden min-h-0'>
						{open && (
							<MapContainer
								center={markerPosition}
								zoom={13}
								style={{ height: '100%', width: '100%' }}
								scrollWheelZoom={true}
								key={`${selectedLat}-${selectedLng}`}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
								/>
								<MapClickHandler onMapClick={handleMapClick} />
								<DraggableMarker
									position={markerPosition}
									onPositionChange={handleMapClick}
								/>
							</MapContainer>
						)}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='latitude'>Широта</Label>
							<Input
								id='latitude'
								type='number'
								step='0.0001'
								value={selectedLat.toFixed(6)}
								onChange={e => {
									const value = Number.parseFloat(e.target.value)
									if (!Number.isNaN(value)) {
										setSelectedLat(value)
									}
								}}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='longitude'>Долгота</Label>
							<Input
								id='longitude'
								type='number'
								step='0.0001'
								value={selectedLng.toFixed(6)}
								onChange={e => {
									const value = Number.parseFloat(e.target.value)
									if (!Number.isNaN(value)) {
										setSelectedLng(value)
									}
								}}
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Отмена
					</Button>
					<Button type='button' onClick={handleConfirm}>
						Применить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
