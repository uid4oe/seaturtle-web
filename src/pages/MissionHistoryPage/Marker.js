import React, {Component} from "react";


import {Card, Icon, Image, Modal, Popup, Segment} from "semantic-ui-react";
import {greatPlaceStyle_DRONE} from "./markerStyle";
import turt from "../../turt.ico";
import MLCanvas from "./MLCanvas";

export default class MyGreatPlace extends Component {

    state = {isOpen: false, counter: 0};

    handleOpen = () => {
        this.setState({isOpen: true, counter: this.state.counter + 1});

    };

    popupOpen = () => {
        this.setState({isOpen: true});

    };

    handleClose = () => {
        this.setState({isOpen: false, counter: 0});
    };

    render() {

        let {picture, text} = this.props;

        if (this.state.counter === 0) {
            return (
                <Popup
                    style={{margin: "0", padding: "0"}}
                    on='click'
                    onOpen={this.popupOpen}
                    onClose={this.handleClose}
                    hideOnScroll
                    open={this.state.isOpen}
                    position="bottom center"
                    trigger={<div style={greatPlaceStyle_DRONE}>
                        {picture.bounding_boxes ? <Image src={turt}/> : <div/>}</div>}>
                    <Card onClick={this.handleOpen} style={{color: "#000000"}}>
                        <Image wrapped src={picture.thumbnail}/>
                        <Segment.Group style={{marginTop: "0", marginBottom: "0"}} compact horizontal>
                            <Segment><h3 style={{textAlign: "center"}}>
                                {text}
                            </h3></Segment>
                            <Segment><h3 style={{textAlign: "center"}}>
                                {picture.bounding_boxes ? <h3>Detected <Icon color="green" name="check"/></h3> :
                                    <h3>Not Detected <Icon color="red" name="cancel"/></h3>}
                            </h3></Segment>
                        </Segment.Group>
                    </Card>
                </Popup>
            );
        } else if (this.state.counter === 1) {


            return <Modal style={{width: "64%"}} open={true} closeIcon onClose={this.handleClose}>
                <Modal.Content>
                    <MLCanvas picture={picture}/>
                    <Segment.Group style={{marginBottom: "0"}} horizontal compact>
                        <Segment>
                            <h3>{new Date(picture.timestamp).toLocaleTimeString()}</h3>
                            Timestamp
                        </Segment>
                        <Segment>
                            <h3>{picture.location.altitude}</h3>
                            Altitude
                        </Segment>
                        <Segment>
                            <h3>{picture.location.latitude}</h3>
                            Latitude
                        </Segment>
                        <Segment>
                            <h3>{picture.location.longitude}</h3>
                            Longitude
                        </Segment>
                    </Segment.Group>
                </Modal.Content>
            </Modal>;
        }

    }
}


