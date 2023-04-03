import React, { SetStateAction, Dispatch } from 'react';
import Modal from './Modal';

type Props = {
    showModal: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    text: string;
}

function WinnerModal(props: Props) {
  return (
    <Modal isVisible={props.showModal} setIsVisible={props.setIsVisible} hideAfter={3000}>
        <Modal.Text text={props.text || ""} />
        <Modal.Button label='OK' close={() => props.setIsVisible(false)} />
    </Modal>
  )
}

export default WinnerModal