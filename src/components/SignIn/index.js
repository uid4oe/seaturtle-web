import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import turtle from "../../turtle.glb"
import {PasswordForgetLink} from '../PasswordForget';
import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {Button, Card, Form, Grid, Header, Message,} from "semantic-ui-react";

const SignInPage = () => (
    <Grid column={2}>
    <Grid.Column width={12}>
      <Card fluid style={{
        height: "80vh",
        width: "100%"
      }}>
        <model-viewer alt="Sea Turtle" autoplay="true" auto-rotate="" auto-rotate-delay="0"
                      camera-controls="" camera-orbit="0deg 75deg 250%%"
                      exposure="0.85"
                      src={turtle}
                      style={{
                        height: "500%",
                        width: "100%",
                        backgroundColor:"#3cddff",
                        progressMask:"#F6F6F6"
                      }}
                      interaction-prompt="none" shadow-intensity="0.65">
        </model-viewer>
      </Card>
    </Grid.Column>
    <Grid.Column width={4}>
      <Grid.Row verticalAlign="bottom"/>
      <Header as="h1" textAlign="center">
        Sign In
      </Header>
      <SignInForm />
      {/*<SignUpLink />*/}
    </Grid.Column>
    </Grid>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div>
        {error && (
          <Message negative>
            <p>{error.message}</p>
          </Message>
        )}
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Email</label>
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
          </Form.Field>
          <Button primary disabled={isInvalid} type="submit">
            Submit
          </Button>
          <PasswordForgetLink />
        </Form>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);


export default SignInPage;

export {SignInForm};
