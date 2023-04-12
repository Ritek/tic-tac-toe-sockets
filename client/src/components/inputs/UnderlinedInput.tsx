import React, { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
}

function UnderlinedInput(props: Props) {
  return (
    <>
        <label className="mr-2" htmlFor={props.name}>{props.label}</label>
        <input className="bg-transparent border-b-2 border-sky-600 outline-none" name={props.name}></input>
    </>
  );
}

export default UnderlinedInput;