import React from "react";

import {greatPlaceStyle} from "./markerStyle.js";
import {Image, Modal, Popup} from "semantic-ui-react";

export default class MyGreatPlace extends React.Component {

  state = { isOpen: false, counter: 0 };

  handleOpen = () => {
    this.setState({ isOpen: true, counter: this.state.counter + 1 });

  };

  hs = () => {
    this.setState({ isOpen: true});

  };

  handleClose = () => {
      this.setState({ isOpen: false, counter: 0 });
  };

  render() {

    let { lat, lng, picture, text } = this.props;

    if (text == null && this.state.counter===0) {
      text = "+";
      return (
        <Popup
          on='click'
          onOpen={this.hs}
          open={this.state.isOpen}
          onClose={this.handleClose}
          hideOnScroll
          position="top center" content={`Lat:${lat} Long:${lng}`}
          trigger={<div style={greatPlaceStyle}> {text}</div>}>
          <Image onClick={this.handleOpen} src={picture.thumbnail}/>
        </Popup>
      );
    } else if (text !== null && this.state.counter===0) {
      return (
        <Popup hideOnScroll position="top center" content={`Lat:${lat} Long:${lng}`}
               trigger={<div style={greatPlaceStyle}> {text}</div>}/>
      );
    }
    else if(this.state.counter===1)
    {
      return (<Modal open={true} closeIcon onClose={this.handleClose}>
        <Modal.Content><Image src={picture.source}/></Modal.Content>
      </Modal>);
    }

  }
}
