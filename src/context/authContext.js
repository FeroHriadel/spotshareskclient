import React, { useReducer, createContext, useEffect } from 'react';
import { auth } from '../firebase';



//helper => get user's role rest call
const getRole = email => {
    return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/getRole/${email}`)
        .then(res => {
            return res.json();
        })
}




//reducer
const firebaseReducer = (state, action) => {
    switch(action.type) {
        case "LOGGED_IN_USER":
            return {...state, user: action.payload}
        default:
            return state;
    }
};



//state
const initialState = {
    user: null
};



//context
const AuthContext = createContext();



//ctx provider
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(firebaseReducer, initialState);
    const value = {state, dispatch};

    //listen for loggedin/out state change in firebase
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();

                //dispatch basic user's info immediately so <PrivateRoute /> and <AdminRoute /> don't complain
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        email: user.email,
                        token: idTokenResult.token,
                    }
                })

                //<PrivateRoute /> and <AdminRoute /> are happy now, we can fetch user's role
                getRole(user.email)
                    .then(data => {
                        if (!data || data.error) {
                            dispatch({
                                type: 'LOGGED_IN_USER',
                                payload: {
                                    email: user.email,
                                    token: idTokenResult.token,
                                    role: 'user'
                                }
                            });
                        } else {
                            dispatch({
                                type: 'LOGGED_IN_USER',
                                payload: {
                                    email: user.email,
                                    token: idTokenResult.token,
                                    role: data.role
                                }
                            });
                        }
                    })

            } else {
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: null
                });
            }
        });

        return () => unsubscribe();
    }, [])

    //return component
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
};

export {AuthContext, AuthProvider};
