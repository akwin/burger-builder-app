import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = { //constants that you use as global constants are capitalized
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: { //this is an object with key:value pairs, with ingredient names being the keys
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4
    }
    
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        const updatedCount = oldCount + 1; // new amount of the ingredients
        const updatedIngredients = {
            ...this.state.ingredients
        }; // to update state in an immutable way, we create a new const 
        // updatedIngredients that uses the spread operator to distribute
        // the properties of the old ingredients state into the new object 
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });
    } //when a new ingredient is added, the state will change and the ingredients and price will change

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1; 
        const updatedIngredients = {
            ...this.state.ingredients };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });

    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        return (
            <Aux>
                <Burger ingredients= {this.state.ingredients} />
                <BuildControls 
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    disabled = {disabledInfo} 
                    price = {this.state.totalPrice}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;