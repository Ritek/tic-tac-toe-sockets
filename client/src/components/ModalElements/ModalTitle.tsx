import react, { ReactElement } from 'react';

type Props = {
  children: string;
  className?: string;
}

function ModalTitle(props: Props) {
  return (
    <h2 className={`w-full text-center text-xl ${props.className}`}>
      {props.children}
    </h2>
  );
}

export default ModalTitle;