import React from "react";


import {Card, Form, Grid, Segment,} from "semantic-ui-react";

function MissionCard(props) {

    const {mission, selectedMission, activeMission, resultMission} = props;

    let count = 0;
    let accuracy = 0;

    if (resultMission || activeMission) {
        if (mission["uploaded-images"]) {
            mission["uploaded-images"].forEach(i => {
                if (i.bounding_boxes) {
                    i.bounding_boxes.forEach(r => {
                        accuracy += r.score;
                        count++;
                    })
                }
            })
        }
    }

    return (mission && selectedMission ? (
            <Card fluid>
                <Card.Content>
                    <Card.Header>
                        Mission Details
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Content>
                        <Card.Description>
                            <Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.route.length}</h3>
                                        Way Points
                                    </Segment>
                                    <Segment>
                                        <h3> {mission.flightTime} Minutes</h3>
                                        Flight Time
                                    </Segment>
                                    <Segment>
                                        <h3> {mission.distance} KM</h3>
                                        Round Trip
                                    </Segment>
                                </Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3 style={{marginBottom: "5px"}}>Created</h3>
                                        {mission && mission.createdBy ? mission.createdBy : "None"}<br/>
                                        {mission && mission.createdAt ? mission.createdAt : "None"}<br/>
                                    </Segment>
                                    <Segment>
                                        <h3 style={{marginBottom: "5px"}}>Edited</h3>
                                        {mission && mission.editedBy ? mission.editedBy : "None"}<br/>
                                        {mission && mission.editedAt ? mission.editedAt : "None"}<br/>
                                    </Segment>
                                </Segment.Group>
                            </Segment.Group>
                        </Card.Description>
                    </Card.Content>
                </Card.Content>
            </Card>
        ) : resultMission ? (<Card fluid>
                    <Card.Content>
                        <Card.Header>
                            Mission Result
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{new Date(mission.started_at).toDateString()}</h3>
                                        Executed Date
                                    </Segment>
                                    <Segment>
                                        <h3>{new Date(mission.started_at).toLocaleTimeString()}</h3>
                                        Started At
                                    </Segment>
                                    <Segment>
                                        <h3>{new Date(mission.finished_at).toLocaleTimeString()}</h3>
                                        Finished At
                                    </Segment>
                                </Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.details.distance} KM</h3>
                                        Distance
                                    </Segment>
                                    <Segment>
                                        <h3>{mission.waypoints.length}</h3>
                                        Waypoints
                                    </Segment>
                                </Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission["uploaded-images"].length}</h3>
                                        Taken Pictures
                                    </Segment>
                                    <Segment>
                                        <h3>{count}</h3>
                                        Sea Turtle Detection
                                    </Segment>
                                    <Segment>
                                        <h3>{(accuracy / count * 100).toFixed(2)}%</h3>
                                        Average Accuracy
                                    </Segment>
                                </Segment.Group>
                            </Card.Description>
                        </Card.Content>
                    </Card.Content>
                </Card>
            ) :
            (activeMission && <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            Mission Progress
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.state}</h3>
                                        State
                                    </Segment>
                                    <Segment>
                                        <h3>{new Date(mission.started_at).toLocaleTimeString()}</h3>
                                        Started At
                                    </Segment>
                                    <Segment>
                                        <h3>{mission.waypoints && mission.waypoints.length}</h3>
                                        Waypoints
                                    </Segment>
                                </Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission["uploaded-images"] && mission["uploaded-images"].length}</h3>
                                        Taken Pictures
                                    </Segment>
                                    <Segment>
                                        <h3>{count}</h3>
                                        Sea Turtle Detection
                                    </Segment>
                                    <Segment>
                                        <h3>{(accuracy / count * 100).toFixed(2)}%</h3>
                                        Average Accuracy
                                    </Segment>
                                </Segment.Group>
                                <Segment.Group>
                                    <Segment>
                                        <h3>Latest Log</h3>
                                    </Segment>
                                    <Segment>
                                        {mission.mission_log &&
                                        <h4>{mission.mission_log.length - 1} - {mission.mission_log[mission.mission_log.length - 1]}</h4>
                                        }
                                    </Segment>
                                </Segment.Group>
                            </Card.Description>
                        </Card.Content>
                    </Card.Content>
                </Card>
            )
    );
}

export default MissionCard;
