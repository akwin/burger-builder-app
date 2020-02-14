import axios from 'axios';
import * as actionTypes from './actionTypes';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    };
};

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
          email: email,
          password: password,
          returnSecureToken: true  
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDLNX2DHq6j_pbkWTs2b3v_6X3aaVf9lQ4';
        if (!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDLNX2DHq6j_pbkWTs2b3v_6X3aaVf9lQ4';
        }
        axios.post(url, authData)
             .then(response => {
                 const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000); 
                 //new date  without args gives us the current date. new date with args gives us a date with the date we pass as an arg
                 localStorage.setItem('token', response.data.idToken); //setItem allows us to store information in the localStorage
                 localStorage.setItem('expirationDate', expirationDate);
                 localStorage.setItem('userId', response.data.localId);
                 dispatch(authSuccess(response.data.idToken, response.data.localId));
                 dispatch(checkAuthTimeout(response.data.expiresIn));
             })
             .catch(err => {
                 dispatch(authFail(err.response.data.error));
             });
        
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};
 
export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token'); //get token from localStorage
        if (!token) { //this means if token is null/ we cannot validate it to be true
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000 ));
            }
        }
    };
};