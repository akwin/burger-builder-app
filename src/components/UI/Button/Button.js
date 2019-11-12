import React from 'react';
import classes from './Button.module.css';

const button = (props) => (
    <button 
        disabled={props.disabled}
        className={[classes.Button, classes[props.btnType], classes.disabled].join(' ')}
        onClick={props.clicked}>{props.children}</button>
);

export default button;