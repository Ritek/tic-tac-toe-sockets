import React, { useState, ChangeEvent, InputHTMLAttributes } from 'react';
import { useModalContext } from './ModalContext';

type SupportedAttributes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

interface Props extends SupportedAttributes {
    label: string;
    className?: string;
}

function ModalCheckbox(props: Props) {
  const { modalState, setModalState } = useModalContext();

  const name = props.name || 'checkbox';
  const initialValue = props.checked || false;

  // const [checkbox, setCheckbox] = useState<boolean>({});

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setModalState({...modalState, [name]: !modalState[name]});
  }

  return (
    <label>
        <span className='mr-2'>{ props.label }:</span>
        <input 
            {...props} 
            type='checkbox' 
            checked={modalState[name] || false} 
            onChange={handleChange} 
            className={`scale-150 ${props.className}`}
            />
    </label>
  );
}

export default ModalCheckbox;