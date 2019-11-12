import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props.ingredients);
        this.setState({loading: true})
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Akanksha',
                address: {
                    street: 'Test Street',
                    zipCode: '55513',
                    country: 'Canada'
                },
                email: 'akanksha@test.com'
                },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
             .then( response => {
                this.setState({loading: false});
                this.props.history.push('/');
             })
             .catch(error => {
                this.setState({loading: false});
             });
    }

    render() {
        let form = (
            <form>
                    <input className={classes.Input} type='text' name='name' placeholder='Your Name' />
                    <input className={classes.Input} type='email' name='email' placeholder='Your Email' />
                    <input className={classes.Input} type='text' name='street' placeholder='Street Name' />
                    <input className={classes.Input} type='text' name='postalcode' placeholder='Your Postal Code' />
                    <Button 
                        btnType='Success'
                        clicked={this.orderHandler}>ORDER</Button>
                </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;