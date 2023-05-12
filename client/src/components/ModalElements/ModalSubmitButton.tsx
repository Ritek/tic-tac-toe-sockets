import { ReactNode } from 'react';
import { useModalContext } from './ModalContext';

type Props = {
  children: ReactNode;
  onClick: (modal: any) => void;
  className?: string;
}

function SubmitButton(props: Props) {
  const { modalState } = useModalContext();

  function handleClick() {
    props.onClick(modalState);
  }

  return (
    <button className={`w-full p-2 bg-sky-600 hover:bg-sky-500 text-xl ${props.className}`} onClick={handleClick}>
      { props.children }
    </button>
  );
}

export default SubmitButton;