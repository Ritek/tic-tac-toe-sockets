import React, { useRef, ChangeEvent, InputHTMLAttributes, HTMLInputTypeAttribute } from 'react';
import { useModalContext } from './ModalContext';

type InputTypes = Extract<HTMLInputTypeAttribute, 'text' | 'number' | 'password' >;

interface ChecboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  type?: InputTypes;
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  className?: string;
  type?: InputTypes;
};

type Props = {
  className?: string;
  checkbox: ChecboxProps;
  input: InputProps;
}

function ModalConditionalInput(props: Props) {
  const { modalState, setModalState } = useModalContext();

  const checkboxName = props.checkbox.name || 'checkbox';
  const inputName = props.input.name || 'input';

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    let newState = {};
    if (!event.target.checked) {
      newState = { [checkboxName]: !modalState[checkboxName], [inputName]: undefined };
    } else {
      newState = { [checkboxName]: !modalState[checkboxName] };
    }

    setModalState({...modalState, ...newState});
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setModalState({...modalState, [event.target.name]: event.target.value});
  }

  return (
    <div className={`mb-2 ${props.className}`}>
      <label>
        <span className='mr-2'>{ props.checkbox.label }</span>
        <input 
          {...props.checkbox} 
          type='checkbox' 
          checked={modalState[checkboxName] || false} 
          onChange={handleCheckboxChange} 
          className={`scale-150 ${props.checkbox.className}`}
        />
      </label>

      {modalState[checkboxName] ?
        <input 
          {...props.input}
          onChange={(e) => handleInputChange(e)}
          className={`bg-white bg-opacity-5 w-full border-b-2 indent-1 border-sky-600 text-2xl ${props.input.className}`} 
        />  : null
      }
    </div>
  );
}

export default ModalConditionalInput;