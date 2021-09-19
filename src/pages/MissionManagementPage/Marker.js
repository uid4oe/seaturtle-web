import React, {Component} from "react";

import {greatPlaceStyle} from "./markerStyle.js";
import {Image, Modal, Popup, Segment, SegmentGroup} from "semantic-ui-react";
import {greatPlaceStyle_DRONE} from "../MissionPage/markerStyle";
import drone_image from "../../drone.png";

export default class MyGreatPlace extends Component {

    state = {isOpen: false, counter: 0};

    handleOpen = () => {
        this.setState({isOpen: true, counter: this.state.counter + 1});

    };

    hs = () => {
        this.setState({isOpen: true});

    };

    handleClose = () => {
        this.setState({isOpen: false, counter: 0});
    };

    render() {

        let {lat, lng, picture, text, drone} = this.props;

        if (drone) {
            return (
                <Popup style={{padding: "0"}} disabled={this.props.hide} hideOnScroll position="top center"
                       trigger={<div style={greatPlaceStyle_DRONE}><Image src={drone_image}/></div>}>
                    <Popup.Content as={SegmentGroup} style={{margin: "0"}} horizontal compact size="small">
                        <Segment><h3>{lat.toFixed(4)}</h3>Latitude</Segment>
                        <Segment><h3>{lng.toFixed(4)}</h3>Longitude</Segment>
                    </Popup.Content>
                </Popup>
            );
        }

        if (text == null && this.state.counter === 0) {
            text = "+";
            return (
                <Popup
                    on='click'
                    onOpen={this.hs}
                    onClose={this.handleClose}
                    hideOnScroll
                    open={this.state.isOpen}
                    position="top center" content={`Lat:${lat} Long:${lng}`}
                    trigger={<div style={greatPlaceStyle}> {text}</div>}>
                    <Image onClick={this.handleOpen} src={picture.thumbnail}/>
                </Popup>
            );
        } else if (text !== null && this.state.counter === 0) {
            return (
                <div onContextMenu={() => this.props.handleRightClick(lat, lng)}>
                    <Popup style={{padding: "0"}} disabled={this.props.hide} hideOnScroll position="top center"
                           trigger={<div style={greatPlaceStyle}> {text}</div>}>
                        <Popup.Content as={SegmentGroup} style={{margin: "0"}} horizontal compact size="small">
                            <Segment><h3>{lat.toFixed(4)}</h3>Latitude</Segment>
                            <Segment><h3>{lng.toFixed(4)}</h3>Longitude</Segment>
                        </Popup.Content>
                    </Popup>
                </div>
            );
        } else if (this.state.counter === 1) {
            return (<Modal open={true} closeIcon onClose={this.handleClose}>
                <Modal.Content><Image src={picture.source}/></Modal.Content>
            </Modal>);
        }

    }
}
