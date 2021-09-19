import React, {Component} from "react";
import {Button, Modal} from "semantic-ui-react";
import Card from "semantic-ui-react/dist/commonjs/views/Card";
import {CommandState} from "../../constants/utils_types";


class CommandItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });


  render() {
    const { command, onClearCommand, onCancelCommand } = this.props;

    return (
      <Card>
        <Card.Content>
          <Card.Header>
            ID: {command.id}
          </Card.Header>
          <Card.Description>
            <div>Operation: {command.operation}</div>
            <div>State: {CommandState[command.state]}</div>
            <div>Status: {command.status}</div>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          {(command.state === CommandState.Completed || command.state === CommandState.Canceled) ? (
            <Button fluid positive icon onClick={() => onClearCommand(command.uid)}>
              Clear
            </Button>) : command.state !== CommandState.Canceling ? (
              <Button fluid negative onClick={() => onCancelCommand(command)}>
                Cancel
              </Button>) :
            <Modal
              trigger={<Button onClick={this.handleOpen} fluid>Cancel by force</Button>}
              open={this.state.modalOpen}
              onClose={this.handleClose}
              size='small'
            >
              <Modal.Header>Cancel by force?</Modal.Header>
              <Modal.Content>
                <Button positive icon onClick={() => {
                  onCancelCommand(command);
                  this.handleClose();
                }}>Yes</Button>
                <Button negative icon onClick={this.handleClose}>No</Button>
              </Modal.Content>
            </Modal>}
        </Card.Content>
      </Card>
    );
  }
}

export default CommandItem;
