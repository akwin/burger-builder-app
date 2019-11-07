import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients';

const burger = (props) => {
// we receive ingredients as props here, as specified in the BurgerBuilder.js
// ingredients is an object which will need to be transformed into an array
// we need an array of the values of the ingredients from the ingredients object

    let transformedIngredients = Object.keys(props.ingredients) 
    //this method allows us to extract the keys of given object (ingredients) into an array of the keys, ['salad', 'bacon', 'cheese', 'meat'].
    // the values of the keys are not part of the array
    .map(igKey => { 
    // chaining this method to the new formed array (created by the Object.keys() call)
    // map executes a function on each element in the calling array
    // we use the name igKey for the argument we receive in the function because that's what the array is made of: 'salad', 'cheese', etc. 
        return [...Array(props.ingredients[igKey])].map((_, i) => {
           return <BurgerIngredient key={igKey + i} type={igKey} />
        }); 
    })
    .reduce((arr, el) => {
        return arr.concat(el)
    }, []);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please add your ingredients!</p>;
    }

    console.log(transformedIngredients);

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom' />
        </div>
    );
};

export default burger;