import React from "react";


import {Button, Card, Form, Grid, Segment,} from "semantic-ui-react";

function MissionCard(props) {

    const {mission, resultMission} = props;

    let count = 0;
    let accuracy = 0;

    if (resultMission) {
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

    return (<Card fluid>
                    <Card.Content>
                        <Card.Header>
                            Latest Mission Result
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.details.name}</h3>
                                        Name
                                    </Segment>
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
                        <Card.Content extra>
                            <Button fluid positive onClick={() => window.location="mission-history"}>Go to detailed results</Button>
                        </Card.Content>
                    </Card.Content>
                </Card>);
}

export default MissionCard;
