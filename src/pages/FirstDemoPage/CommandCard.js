import React, {Component} from "react";
import CommandList from "./CommandList";


import {Button, Card, Loader, Message,} from "semantic-ui-react";
import {CommandState} from "../../constants/utils_types";

class CommandCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      commands: [],
    };
  }

  componentDidMount() {
    this.onListenForCommands();
  }

  componentWillUnmount() {
    this.props.firebase.piCommands().off();
  }

  onListenForCommands = () => {
    this.setState({ loading: true });

    this.props.firebase
      .commandQueue()
      .orderByChild("createdAt")
      .on("value", snapshot => {
        const commandObject = snapshot.val();

        if (commandObject) {
          const commandList = Object.keys(commandObject).map(key => ({
            ...commandObject[key],
            uid: key,
          }));

          this.setState({
            commands: commandList.reverse(),
            loading: false,
          });

        } else {
          this.setState({ commands: null, loading: false });
        }
      });

  };
  onCreateCommand = async () => {
    const transactionResult = await this.props.firebase.piCommands().child("counter").transaction(
      (counter) => counter + 1,
    );
    const commandCounter = transactionResult.snapshot.val();

    this.props.firebase.commandQueue().push({
      id: commandCounter,
      operation: "Take Picture",
      state: CommandState.Pending,
      status: "Pending...",
      timestamp: Date.now(),
    });
  };

  onCancelCommand = (command) => {
    const { uid, ...commandSnapshot } = command;
    let newState = (command.state === CommandState.Pending) ? CommandState.Canceled : CommandState.Canceling;
    let newStatus = (newState === CommandState.Canceled) ? "Canceled by user" : commandSnapshot.status;
    this.props.firebase.command(uid).set({
      ...commandSnapshot,
      state: newState,
      status: newStatus,
    });

    if(commandSnapshot.state === CommandState.Canceling){
      this.props.firebase.command(uid).set(null);
    }

  };

  onClearCommand = uid => {
    this.props.firebase.command(uid).remove();
  };

  deleteImages = () => {
    return fetch("https://europe-west1-turtle-cloud.cloudfunctions.net/app/api/image-uploads/delete-all");
  };


  sendRequest(){
    return fetch("https://europe-west1-turtle-cloud.cloudfunctions.net/app/api/mock/image-upload");
  }

  render() {
    const { commands, loading } = this.state;

    return (
      <Card fluid={true}>
        <Card.Content>
          {!loading && (
            <Button fluid primary type="submit"
                    onClick={this.onCreateCommand}>
              Take Picture
            </Button>)}
        </Card.Content>
        <Card.Content>
          {!loading && (
              <Button fluid primary type="submit"
                      onClick={this.sendRequest}>
                Get Random
              </Button>)}
        </Card.Content>
        <Card.Content>
          <Card.Description>
            {loading && <Loader active inline="centered"/>}
            {commands && (
              <CommandList
                commands={commands}
                onCancelCommand={this.onCancelCommand}
                onClearCommand={this.onClearCommand}
              />
            )}
            {!loading && !commands && (
              <Message info>
                <p>There are no commands in the queue ...</p>
              </Message>
            )}
          </Card.Description>
        </Card.Content>
        <Card.Content>
          {!loading && commands &&(
            <Button fluid negative type="submit"
                    onClick={this.deleteImages}>
              Delete All Images
            </Button>)}
        </Card.Content>
      </Card>
    );
  }
}

export default CommandCard;
