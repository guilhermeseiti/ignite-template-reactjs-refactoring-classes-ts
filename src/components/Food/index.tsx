import { useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';

interface FoodProps {
	id: number;
	image: string;
	name: string;
	description: string;
	price: string;
	available: boolean;
}

interface FoodComponentProps {
	food: FoodProps;
	handleEditFood: (food: FoodProps) => void;
	handleDelete: (id: number) => void;
}
export function Food({
	food,
	handleEditFood,
	handleDelete,
}: FoodComponentProps) {
	const [isAvailable, setIsAvailable] = useState<boolean>(food.available);

	async function toggleAvailable() {
		await api.put(`/foods/${food.id}`, {
			...food,
			available: !isAvailable,
		});

		setIsAvailable(!isAvailable);
	}

	function setEditingFood() {
		handleEditFood(food);
	}

	return (
		<Container available={isAvailable}>
			<header>
				<img src={food.image} alt={food.name} />
			</header>
			<section className='body'>
				<h2>{food.name}</h2>
				<p>{food.description}</p>
				<p className='price'>
					R$ <b>{food.price}</b>
				</p>
			</section>
			<section className='footer'>
				<div className='icon-container'>
					<button
						type='button'
						className='icon'
						onClick={setEditingFood}
						data-testid={`edit-food-${food.id}`}
					>
						<FiEdit3 size={20} />
					</button>

					<button
						type='button'
						className='icon'
						onClick={() => handleDelete(food.id)}
						data-testid={`remove-food-${food.id}`}
					>
						<FiTrash size={20} />
					</button>
				</div>

				<div className='availability-container'>
					<p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

					<label htmlFor={`available-switch-${food.id}`} className='switch'>
						<input
							id={`available-switch-${food.id}`}
							type='checkbox'
							checked={isAvailable}
							onChange={toggleAvailable}
							data-testid={`change-status-food-${food.id}`}
						/>
						<span className='slider' />
					</label>
				</div>
			</section>
		</Container>
	);
}
