import { useEffect, useRef, useState, useCallback } from 'react';

import { useField } from '@unform/core';

import { Container } from './styles';

interface InputProps {
	name: string;
	placeholder: string;
	icon?: React.ElementType;
}

export function Input({ name, icon: Icon, ...rest }: InputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isFocused, setIsFocused] = useState(false);
	const [isFilled, setIsFilled] = useState(false);

	const { fieldName, defaultValue, registerField } = useField(name);

	const handleInputFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	const handleInputBlur = useCallback(() => {
		setIsFocused(false);

		setIsFilled(!!inputRef.current?.value);
	}, []);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',
		});
	}, [fieldName, registerField]);

	return (
		<Container isFilled={isFilled} isFocused={isFocused}>
			{Icon && <Icon size={20} />}

			<input
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				defaultValue={defaultValue}
				ref={inputRef}
				{...rest}
			/>
		</Container>
	);
}
