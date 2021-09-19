import MissionS from './MissionS';

import React from 'react';
import {compose} from 'recompose';

import {withAuthorization, withEmailVerification} from '../../components/Session';

const MissionSelection = () => (
    <MissionS/>
);

const condition = authUser => (authUser === null ? false : authUser);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(MissionSelection);

