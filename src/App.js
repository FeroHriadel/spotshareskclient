import React, { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { Switch, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks'

import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import CompleteRegistration from './pages/CompleteRegistration';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Admin from './pages/Admin';
import ManageCategories from './pages/ManageCategories';
import CreateCategory from './pages/CreateCategory';
import EditCategory from './pages/EditCategory';
import CreateTag from './pages/CreateTag';
import ManageTags from './pages/ManageTags';
import EditTag from './pages/EditTag';
import AddSpot from './pages/AddSpot';
import NotFound from './pages/NotFound';



const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;


  
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    request: operation => {
      operation.setContext({
        headers: {
          authtoken: user ? user.token : ''
        }
      })
    }
  });



  return (
      <ApolloProvider client={client}>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path = '/register' component={Register} />
          <Route exact path = '/completeregistration' component={CompleteRegistration} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/forgotpassword' component={ForgotPassword} />
          <PrivateRoute exact path='/profile' component={Profile} />
          <AdminRoute exact path='/admin' component={Admin} />
          <AdminRoute exact path='/managecategories' component={ManageCategories} />
          <AdminRoute exact path='/createcategory' component={CreateCategory} />
          <AdminRoute exact path='/editcategory/:categoryslug' component={EditCategory} />
          <AdminRoute exact path='/createtag' component={CreateTag} />
          <AdminRoute exact path='/managetags' component={ManageTags} />
          <AdminRoute exact path='/edittag/:tagslug' component={EditTag} />
          <PrivateRoute exact path='/addspot' component={AddSpot} />
          <Route component={NotFound} />
        </Switch>
      </ApolloProvider>
  );
}

export default App;
