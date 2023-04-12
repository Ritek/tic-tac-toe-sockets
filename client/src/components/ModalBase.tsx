import React, { useEffect, SetStateAction, Dispatch } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector("#modal-root") as HTMLElement;

type Props = {
    children: React.ReactNode;
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    hideAfter?: number;
}

const ModalBase = function(props: Props) {

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
    <div className={`${props.isVisible ? 'visible' : 'invisible'} z-20 fixed flex top-0 left-0 w-full h-full`}>
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-75'/>
        {/* <div className="z-50 relative w-4/5 sm:w-2/5 m-auto">
          { props.children }
        </div> */}
        <div className="z-50 flex w-full h-full m-auto justify-center items-center"> {/* place-items-center */}
          { props.children }
        </div>
    </div>,
    modalRoot
  );
}

export default ModalBase