import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import { useModalContext } from './ModalContext';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: 'password';
}

function PasswordInput(props: Props) {
  const { modalState, setModalState } = useModalContext();

  const name = props.name || 'password';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setModalState({...modalState, [event.target.name]: event.target.value});
  }

  return (
    <input 
      {...props}
      type='password' 
      name={name} 
      value={modalState[name]}
      placeholder={props.placeholder || 'password'} 
      onChange={(e) => handleChange(e)}
      className={`bg-white bg-opacity-5 w-full border-b-2 indent-1 border-sky-600 text-2xl ${props.className}`} 
    />         
  );
}

export default PasswordInput;