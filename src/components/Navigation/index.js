import React, {useState} from "react";
import {Link} from "react-router-dom";

import {AuthUserContext} from "../Session";
import SignOutButton from "../SignOut";

import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

import {Container, Menu} from "semantic-ui-react";

const Navigation = () => {

    let i = null;
    switch (window.location.pathname.toString()) {
        case "/" || "":
            i = 1;
            break;
        case "/mission":
            i = 2;
            break;
        case "/mission-history":
            i = 3;
            break;
        case "/mission-management":
            i = 4;
            break;
        case "/user-management":
            i = 5;
            break;
        case"/account":
            i = 6;
            break;
    }

    const [index, setIndex] = useState(i);

    return (
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? (
                    <Menu size="huge" widths={7}>
                        <Container fluid>
                            <Menu.Item onClick={() => setIndex(1)} active={index === 1} name="Dashboard" as={Link}
                                       to={ROUTES.HOME}/>
                            <Menu.Item onClick={() => setIndex(2)} active={index === 2} name="Mission" as={Link}
                                       to={ROUTES.MISSION}/>
                            <Menu.Item onClick={() => setIndex(3)} active={index === 3} name="Mission History" as={Link}
                                       to={ROUTES.MISSION_HISTORY}/>
                            {(authUser.role === ROLES.EXPERT || authUser.role === ROLES.ADMIN) && (
                                <Menu.Item onClick={() => setIndex(4)} active={index === 4} name="Mission Management"
                                           as={Link} to={ROUTES.MISSION_MANAGEMENT}/>
                            )}
                            {authUser.role === ROLES.ADMIN && (
                                <Menu.Item onClick={() => setIndex(5)} active={index === 5} name="User Management"
                                           as={Link} to={ROUTES.USER_MANAGEMENT}/>)}
                            <Menu.Item onClick={() => setIndex(6)} active={index === 6} name="Account" as={Link}
                                       to={ROUTES.ACCOUNT}/>
                            <SignOutButton/>
                        </Container>
                    </Menu>
                ) : (
                    <Menu size="huge" widths={1}>
                        <Container fluid>
                            <Menu.Item name="SeaTurtle Web" as={Link} to={ROUTES.HOME}/>
                        </Container>
                    </Menu>
                )
            }
        </AuthUserContext.Consumer>);
};


export default Navigation;
