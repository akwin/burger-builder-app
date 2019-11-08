import React from 'react';
import classes from './Modal.module.css';

const modal = (props) => (
    <div className={classes.Modal}>
        {props.children}
    </div>
    //this is a div that wraps around {props.children}
);

export default modal;