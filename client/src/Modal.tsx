import React, { useEffect, SetStateAction, Dispatch, Children } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  hideAfter?: number
  children?: React.ReactNode
}

type TextProps = {
  text: string;
}

type ButtonProps = {
  label: string;
  close: () => void;
}

const Text = function(props: TextProps) {
  return (
    <p className='m-5 text-3xl'>{props.text}</p>
  );
}

const Button = function(props: ButtonProps) {
  return (
    <button className='m-5' onClick={props.close}>{props.label}</button>
  );
}

const modalRoot = document.querySelector("#modal-root") as HTMLElement;

const Modal = function(props: Props) {

  useEffect(() => {
    const visibleTimeout = setTimeout(() => {
      props.setIsVisible(false);
    }, props.hideAfter || 3000);

    !props.hideAfter ? clearTimeout(visibleTimeout) : null;

    return () => {
      clearTimeout(visibleTimeout);
      visibleTimeout;
    }
  }, [props.isVisible]);

  return createPortal(
    <>
      <div className={`${props.isVisible ? 'visible' : 'invisible'} z-20 fixed top-0 right-0 flex w-full h-full items-center text-center`}>
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-75'/>
        <div className="z-50 relative w-4/5 sm:w-2/5 bg-sky-500 m-auto rounded-xl font-bold">
          { props.children }
        </div>
      </div>
    </>,
    modalRoot
  );
}

Modal.Text = Text;
Modal.Button = Button;

export default Modal