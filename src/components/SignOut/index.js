import React from 'react';

import {withFirebase} from '../Firebase';

import {Menu} from 'semantic-ui-react';

const SignOutButton = ({ firebase }) => (
    <Menu.Item name="Logout" onClick={firebase.doSignOut} />
);

export default withFirebase(SignOutButton);
