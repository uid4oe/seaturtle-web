import React from "react";
import {Card, Segment} from "semantic-ui-react";
import {withFirebase} from "./Firebase";
import Loading from "./Loading";

function DroneStatusCard(props) {

    const droneStatus = props.drone;

    return (droneStatus ? <Card fluid>
        <Card.Content>
            <Card.Header>Drone Details</Card.Header>
        </Card.Content>
        <Card.Content>
            <Card.Description>
                <Segment.Group>
                    <Segment.Group horizontal>
                        <Segment>
                            <h3>{droneStatus.airspeed.toFixed(2)}</h3>
                            Air Speed
                        </Segment>
                        <Segment>
                            <h3> {droneStatus.battery}%</h3>
                            Battery
                        </Segment>
                        <Segment>
                            <h3> {droneStatus.state}</h3>
                            State
                        </Segment>
                    </Segment.Group>
                    <Segment.Group horizontal>
                        <Segment>
                            <h3>{droneStatus.location.altitude}</h3>
                            Altitude
                        </Segment>
                        <Segment>
                            <h3>{droneStatus.mode}</h3>
                            Mode
                        </Segment>
                        <Segment>
                            <h3> {droneStatus.armed ? "True" : "False"}</h3>
                            Armed
                        </Segment>
                        <Segment>
                            <h3> {droneStatus.status ? "Online" : "Offline"}</h3>
                            Status
                        </Segment>
                    </Segment.Group>
                </Segment.Group>
            </Card.Description>
        </Card.Content>
    </Card> : <Loading size={100}/>);

}

export default withFirebase(DroneStatusCard);
