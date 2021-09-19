import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Navigation from "../components/Navigation";
import SignUpPage from "../components/SignUp";
import SignInPage from "../components/SignIn";
import PasswordForgetPage from "../components/PasswordForget";
import Home from "../pages/DashboardPage";
import AccountPage from "../pages/AccountPage";
import AdminPage from "../pages/UserManagementPage";
import MissionSelection from "../pages/MissionPage";
import MissionManagement from "../pages/MissionManagementPage";

import * as ROUTES from "../constants/routes";
import {withAuthentication} from "../components/Session";

import {Container} from "semantic-ui-react";
import MissionResults from "../pages/MissionHistoryPage";

//<Route render={() => <Redirect to={{pathname: ROUTES.HOME}} />} />

const App = () => (
    <Router>
        <>
            <Navigation/>
            <Container className="stickyContainer">
                <Route exact path={ROUTES.HOME} component={Home}/>
                <Route exact path={ROUTES.MISSION} component={MissionSelection}/>
                <Route exact path={ROUTES.MISSION_HISTORY} component={MissionResults}/>
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage}/>
                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage}/>
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForgetPage}
                />
                <Route exact path={ROUTES.ACCOUNT} component={AccountPage}/>
                <Route exact path={ROUTES.USER_MANAGEMENT} component={AdminPage}/>
                <Route exact path={ROUTES.MISSION_MANAGEMENT} component={MissionManagement}/>
            </Container>
        </>
    </Router>
);

export default withAuthentication(App);
