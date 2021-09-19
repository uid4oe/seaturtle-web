import React, {Component} from "react";
import {Button, Card, Container, Grid, Icon, Image, Modal, Segment, Tab} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import {MAPS_CONFIG} from "../../config";
import {withFirebase} from "../../components/Firebase";
import MLCanvas from "./MLCanvas";

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 11;

const mapBorder = {width: "100% ", height: "75vh "};

class MissionHistoryModal extends Component {
    constructor(props) {
        super(props);


        this.state = {
            mission: this.props.mission,
        };

    }

    deleteMission = () => {
        this.props.firebase.missionHistory(this.props.mission.uid).delete().then(this.props.refresh());
    };

    panes = [
        {
            menuItem: "Details",
            render: () => {

                const {mission} = this.state;
                let count = 0;
                let accuracy = 0;
                mission["uploaded-images"].forEach(i => {
                    if (i.bounding_boxes) {
                        i.bounding_boxes.forEach(r => {
                            accuracy += r.score;
                            count++;
                        })
                    }
                });

                return (
                    <Grid columns={2}>
                        <Grid.Column width={12}>
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
                                    <h3>{(accuracy/count*100).toFixed(2)}%</h3>
                                    Average Accuracy
                                </Segment>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Segment.Group>
                                <Segment>
                                    <h3>Mission Logs</h3>
                                </Segment>
                                <Segment style={{overflowY: 'scroll', maxHeight: '500px'}}>
                                    {mission.mission_log.map((ml, i) => <h4>{i + 1} - {ml}</h4>)}
                                </Segment>
                            </Segment.Group>
                        </Grid.Column>
                    </Grid>
                )
                    ;
            }
        },
        {
            menuItem: "Images on Map",
            render: () => {
                const {mission} = this.state;
                const pictures = mission["uploaded-images"];
                return (<Card fluid>
                    <Container style={mapBorder}>
                        <GoogleMapReact
                            bootstrapURLKeys={MAPS_CONFIG}
                            center={this.missionCenter(mission)}
                            zoom={this.missionZoom(mission)}
                            options={{mapTypeControl: true, mapTypeId: "satellite",tilt:0}}
                        >
                            {pictures && pictures.map((p, index) => {
                                return (<MyGreatPlace
                                    lat={p.location.latitude} lng={p.location.longitude} id={"Picture" + index + 1}
                                    picture={p} text={index + 1}
                                />);
                            })}
                        </GoogleMapReact>
                    </Container>
                </Card>)
            }
        },
        {
            menuItem: "Image Gallery",
            render: () => {
                const {mission} = this.state;
                const pictures = mission["uploaded-images"];

                return (<Card.Group itemsPerRow={5} style={{overflowY: 'scroll', maxHeight: '600px' }}>
                    {pictures.map((picture, i) => (
                        <Modal style={{width: "63.5%"}} closeIcon trigger={<Card style={{color: "#000000"}}>
                            <Image wrapped src={picture.thumbnail}></Image>
                            <Segment.Group style={{marginTop: "0", marginBottom: "0"}} compact horizontal>
                                <Segment><h3 style={{textAlign: "center"}}>
                                    {i+1}
                                </h3></Segment>
                                <Segment><h3 style={{textAlign: "center"}}>
                                    {picture.bounding_boxes ? <h3>Detected <Icon color="green" name="check"/></h3> :
                                        <h3>Not Detected <Icon color="red" name="cancel"/></h3>}
                                </h3></Segment>
                            </Segment.Group>
                        </Card>}>
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
                        </Modal>

                    ))}
                </Card.Group>)
            }
        },
        {
            menuItem: () => <Button style={{margin: "0"}} fluid negative onClick={() => this.deleteMission()}>
                <Icon name="trash"/>Delete</Button>
        }

    ];

    missionCenter = (mission) => {
        if (!mission) {
            return defaultCenter;
        }

        let locations = mission["uploaded-images"];

        let long = 0;
        let lat = 0;

        locations.forEach(r => {
            long += r.location.longitude;
            lat += r.location.latitude;
        });
        return {lat: lat / locations.length, lng: long / locations.length};
    };

    missionZoom = (mission) => {

        let distance = mission.details.distance;

        if (!mission) {
            return defaultZoom;
        }

        let zoom = defaultZoom;

        if (distance > 0) {
            zoom = 19;
        }

        if (distance > 1) {
            zoom = 16;
        }
        if (distance > 2) {
            zoom = 15;
        }
        if (distance > 4) {
            zoom = 14;
        }
        if (distance > 8) {
            zoom = 13;
        }

        return zoom + 1.5;
    };

    render() {

        return (
            <Grid columns={1}>
                <Grid.Column>
                    <Tab menu={{attached: false, widths: 4}} panes={this.panes}/>
                </Grid.Column>
            </Grid>);
    }
}


export default withFirebase(MissionHistoryModal);
