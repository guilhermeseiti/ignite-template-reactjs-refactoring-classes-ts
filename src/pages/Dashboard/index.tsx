import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProps {
	id: number;
	name: string;
	description: string;
	price: string;
	available: boolean;
	image: string;
}

export function Dashboard() {
	const [foods, setFoods] = useState<FoodProps[]>([]);
	const [editingFood, setEditingFood] = useState<FoodProps>({
		id: 100,
		name: '',
		description: '',
		price: '',
		available: false,
		image: '',
	});
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await api.get('/foods');
			setFoods(response.data);
		};
		fetchData();
	}, []);

	const handleAddFood = async (food: FoodProps) => {
		try {
			const response = await api.post('/foods', {
				...food,
				available: true,
			});

			setFoods([...foods, response.data]);
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpdateFood = async (food: FoodProps) => {
		try {
			const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
				...editingFood,
				...food,
			});

			const foodsUpdated = foods.map((f) =>
				f.id !== foodUpdated.data.id ? f : foodUpdated.data,
			);

			setFoods(foodsUpdated);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeleteFood = async (id: number) => {
		await api.delete(`/foods/${id}`);

		const foodsFiltered = foods.filter((food) => food.id !== id);

		setFoods(foodsFiltered);
	};

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	const toggleEditModal = () => {
		setEditModalOpen(!editModalOpen);
	};

	const handleEditFood = (food: FoodProps) => {
		setEditingFood(food);
		setEditModalOpen(true);
	};

	return (
		<>
			<Header openModal={toggleModal} />
			<ModalAddFood
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				handleAddFood={handleAddFood}
			/>
			<ModalEditFood
				isOpen={editModalOpen}
				setIsOpen={toggleEditModal}
				editingFood={editingFood}
				handleUpdateFood={handleUpdateFood}
			/>

			<FoodsContainer data-testid='foods-list'>
				{foods &&
					foods.map((food) => (
						<Food
							key={food.id}
							food={food}
							handleDelete={handleDeleteFood}
							handleEditFood={handleEditFood}
						/>
					))}
			</FoodsContainer>
		</>
	);
}
