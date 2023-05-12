import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
}

function ModalText(props: Props) {
  return (
    <p className={`w-full text-center ${props.className}`}>
      {props.children}
    </p>
  );
}

export default ModalText;