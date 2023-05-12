import { ReactElement } from "react";

type Props = {
  children: ReactElement<SVGElement>;
  width?: string;
  height?: string;
  className?: string;
}

function ModalSvg(props: Props) {
  return (
    <svg 
        width={props.width || "70"} 
        height={props.height || "70"} 
        viewBox="0 0 24 24" 
        className={`fill-white m-auto ${props.className}`}
      >
      {props.children}
    </svg>
  )
}

export default ModalSvg;