import React from 'react';
import {compose} from 'recompose';

import {AuthUserContext, withAuthorization, withEmailVerification,} from '../../components/Session';
import {PasswordForgetForm} from '../../components/PasswordForget';
import PasswordChangeForm from '../../components/PasswordChange';

import {Card, Grid, Header,} from 'semantic-ui-react';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <>
                <Header as="h1">Account: {authUser.email}</Header>
                <Grid columns={2}>
                    <Grid.Column>
                        <Card fluid={true}>
                            <Card.Content>
                                <Card.Header>Reset Password</Card.Header>
                                <Card.Description>
                                    <PasswordForgetForm/>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column>
                        <Card fluid={true}>
                            <Card.Content>
                                <Card.Header>New Password</Card.Header>
                                <Card.Description>
                                    <PasswordChangeForm/>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
            </>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => (authUser === null ? false : authUser);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(AccountPage);
