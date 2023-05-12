import React, { ChangeEvent, InputHTMLAttributes, HTMLInputTypeAttribute } from 'react';
import { useModalContext } from './ModalContext';

type InputTypes = Extract<HTMLInputTypeAttribute, 'text' | 'number' | 'password' >

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  type?: InputTypes;
}

function ModalInput(props: Props) {
  const { modalState, setModalState } = useModalContext();

  const name = props.name || 'input';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setModalState({...modalState, [event.target.name]: event.target.value});
  }

  return (
    <input 
      {...props}
      value={modalState[name] || ''}
      onChange={(e) => handleChange(e)}
      className={`bg-white bg-opacity-5 w-full border-b-2 indent-1 border-sky-600 text-2xl ${props.className}`} 
    />  
  );
}

export default ModalInput;