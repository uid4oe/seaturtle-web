import React from "react";
import {compose} from "recompose";

import {withAuthorization, withEmailVerification} from "../../components/Session";
import ForDemo from "./FirstDemo";
import {Container} from "semantic-ui-react";


const Demo = () => (
    <Container>
        <h1>First Demo</h1>
        <ForDemo/>
    </Container>
);

const condition = authUser => (authUser===null ? false : authUser);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(Demo);
