import React from 'react';
import {compose} from 'recompose';

import {withAuthorization, withEmailVerification} from '../../components/Session';
import MissionH from "./MissionH";

const MissionResults = () => (
        <MissionH/>
);

const condition = authUser => (authUser === null ? false : authUser);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(MissionResults);

