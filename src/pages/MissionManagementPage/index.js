import React from 'react';
import {compose} from 'recompose';

import {withAuthorization, withEmailVerification} from '../../components/Session';
import * as ROLES from "../../constants/roles";
import MissionM from "./MissionM";

const MissionManagement = () => (
        <MissionM/>
);

const condition = authUser => (authUser === null ? false : authUser.role === ROLES.ADMIN || authUser.role === ROLES.EXPERT);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(MissionManagement);

