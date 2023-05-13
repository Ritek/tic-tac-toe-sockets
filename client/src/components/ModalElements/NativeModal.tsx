import React, { useState, useEffect, useRef, ReactNode } from 'react';

import ModalContext from './ModalContext';
import ModalSvg from './ModalSvg';
import ModalTitle from './ModalTitle';
import ModalText from './ModalText';
import PasswordInput from './ModalPassword';
import SubmitButton from './ModalSubmitButton';
import ModalInput from './ModalInput';
import ModalCheckbox from './ModalCheckbox';
import ModalConditionalInput from './ModalConditionalInput';
import ModalCloseButton from './ModalCloseButton';

type Props = {
  isVisible: boolean;
  close: () => void;
  children?: ReactNode;
  hideAfter?: number;
  className?: string;
}

function NativeModal(props: Props) {
  const [modalState, setModalState] = useState<Record<string, any>>({});

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    return dialogRef.current?.close();
  }, []);

  useEffect(() => {
    // const hideTimeout = setTimeout(
    //   () => props.close(),
    //   props.hideAfter
    // );

    props.isVisible
      ? dialogRef.current?.showModal()
      : dialogRef.current?.close()

    // return () => {
    //   clearTimeout(hideTimeout);
    //   hideTimeout;
    // }
  }, [props.isVisible]);

  return (
    <dialog 
        ref={dialogRef} 
        className={`min-w-[300px] min-h-[200px] bg-[#242424] border-2 border-[#1e1e1e] backdrop:backdrop-blur-sm ${props.className}`}
      >
      <ModalContext.Provider value={{ modalState, setModalState }}>
        { props.children }
      </ModalContext.Provider>
    </dialog>
  );
}

NativeModal.CloseButton = ModalCloseButton;
NativeModal.SVG = ModalSvg;
NativeModal.Title = ModalTitle;
NativeModal.Text = ModalText;
NativeModal.Input = ModalInput;
NativeModal.PasswordInput = PasswordInput;
NativeModal.Checkbox = ModalCheckbox;
NativeModal.SubmitButton = SubmitButton;
NativeModal.ConditionalInput = ModalConditionalInput;

export default NativeModal;