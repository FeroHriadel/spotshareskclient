import React, { useContext, lazy, Suspense } from 'react';
import { AuthContext } from './context/authContext';
import { Switch, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks'
import Layout from './components/Layout';

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
import Spot from './pages/Spot';
import AllSpots from './pages/AllSpots';
import EditSpot from './pages/EditSpot';
import SearchSpots from './pages/SearchSpots';
import Comments from './pages/Comments';
import AddComment from './pages/AddComment';
import MySpots from './pages/MySpots';
import SearchUsers from './pages/SearchUsers';
import PublicProfile from './pages/PublicProfile';
import UsersSpots from './pages/UsersSpots';
import SpotsMap from './pages/SpotsMap';
import NotFound from './pages/NotFound';

/*with lazy & suspense
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Register = lazy(() => import('./pages/Register'));
const CompleteRegistration = lazy(() => import('./pages/CompleteRegistration'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const Admin = lazy(() => import('./pages/Admin'));
const ManageCategories = lazy(() => import('./pages/ManageCategories'));
const CreateCategory = lazy(() => import('./pages/CreateCategory'));
const EditCategory = lazy(() => import('./pages/EditCategory'));
const CreateTag = lazy(() => import('./pages/CreateTag'));
const ManageTags = lazy(() => import('./pages/ManageTags'));
const EditTag = lazy(() => import('./pages/EditTag'));
const AddSpot = lazy(() => import('./pages/AddSpot'));
const Spot = lazy(() => import('./pages/Spot'));
const AllSpots = lazy(() => import('./pages/AllSpots'));
const EditSpot = lazy(() => import('./pages/EditSpot'));
const SearchSpots = lazy(() => import('./pages/SearchSpots'));
const Comments = lazy(() => import('./pages/Comments'));
const AddComment = lazy(() => import('./pages/AddComment'));
const MySpots = lazy(() => import('./pages/MySpots'));
const SearchUsers = lazy(() => import('./pages/SearchUsers'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const UsersSpots = lazy(() => import('./pages/UsersSpots'));
const SpotsMap = lazy(() => import('./pages/SpotsMap'));
const NotFound = lazy(() => import('./pages/NotFound'));
*/


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
        {/*<Suspense fallback={
          <Layout>
            <h1 style={{
              fontFamily: `Tulpen One`,
              color: `#9c3611`,
              textAlign: `center`,
              fontWeight: `bold`
            }}>
              Loading...
            </h1>
          </Layout>
        }>*/}
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
            <Route exact path='/spot/:spotslug' component={Spot} />
            <Route exact path='/allspots' component={AllSpots} />
            <Route exact path='/spotsmap' component={SpotsMap} />
            <PrivateRoute exact path='/editspot/:spotslug' component={EditSpot} />
            <Route exact path='/searchspots' component={SearchSpots} />
            <Route exact path='/comments/:spotslug' component={Comments} />
            <PrivateRoute exact path='/addcomment/:spotslug' component={AddComment} />
            <PrivateRoute exact path='/myspots' component={MySpots} />
            <Route exact path='/searchusers' component={SearchUsers} />
            <Route exact path='/publicprofile/:username' component={PublicProfile} />
            <Route exact path='/usersspots/:username' component={UsersSpots} />
            <Route component={NotFound} />
          </Switch>
        {/*</Suspense>*/}
      </ApolloProvider>
  );
}

export default App;
