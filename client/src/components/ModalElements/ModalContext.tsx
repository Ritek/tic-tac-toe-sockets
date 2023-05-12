import { createContext, useContext } from "react";

type ModalStateType = {
    modalState: Record<string, any>,
    setModalState: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

const modalState: ModalStateType = {
    modalState: {},
    setModalState: () => {}
}

const ModalContext = createContext<ModalStateType>(modalState);

export function useModalContext() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error(
            'Modal.* component must be rendered as a child of Modal component'
        );
    }

    return context;
}

export default ModalContext;