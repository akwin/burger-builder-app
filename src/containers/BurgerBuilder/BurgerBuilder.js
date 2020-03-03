import React, { useState, useEffect, useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';


export const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    });

    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice
    });

    const error = useSelector(state => {
        return state.burgerBuilder.error
    });

    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null
    });


    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
       onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]; 
                //replace old values ['salad', 'cheese',] with new values which are the amounts of ingredients
            })
            .reduce((sum, el) => { 
                //reduce the array to turn it into a single number which the sum of all amounts
                return sum + el;
            }, 0); //sum is either 0 (when no ingredients are added) or the sum of ingredients added
            return sum > 0; //sum > 0 is either true or false which changes the state
    }
    
    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
           onSetAuthRedirectPath('/checkout');
           props.history.push('/auth');
        } 
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

        const disabledInfo = {
            ...ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = error ? <p>Ingredients cannot be loaded!</p> :
                     <Spinner />;

        if (ings) {
            burger = (
                <Aux>
                    <Burger ingredients= {ings} />
                    <BuildControls 
                        ingredientAdded = {onIngredientAdded}
                        ingredientRemoved = {onIngredientRemoved}
                        disabled = {disabledInfo}
                        purchaseable={updatePurchaseState(ings)}
                        ordered={purchaseHandler} 
                        isAuth={isAuthenticated}
                        price = {price}/>
                </Aux>);

                orderSummary =  <OrderSummary 
                ingredients={ings}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                price={price}/>
        }

        return (
            <Aux>
                <Modal show={purchasing} 
                       modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
}

//const mapStateToProps = state => {
  //  return {
    //    ings: state.burgerBuilder.ingredients,
      //  price: state.burgerBuilder.totalPrice,
       // error: state.burgerBuilder.error,
       // isAuthenticated: state.auth.token !== null
    //};
//}

//const mapDispatchToProps = dispatch => {
  //  return {
    //    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
      //  onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        //onInitIngredients: () => dispatch(actions.initIngredients()),
        //onInitPurchase: () => dispatch(actions.purchaseInit()),
        //onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    //};
//}

export default (withErrorHandler(BurgerBuilder, axios));