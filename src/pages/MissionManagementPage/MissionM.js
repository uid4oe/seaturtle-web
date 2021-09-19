import React, {Component} from "react";
import {Button, Card, Container, Dropdown, Form, Grid, Icon, Message, Popup, Segment} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
// should be from ./Marker
import MyGreatPlace from "./Marker";
import {withFirebase} from "../../components/Firebase";
import {MAPS_CONFIG} from "../../config";
import {getDistance} from "geolib";
import Loading from "../../components/Loading";

const mapBorder = {width: "100% ", height: "80vh"};

//{lat: 35.197970240448015, lng: 33.532330183981806};
const defaultCenter = {lat:-35.3631,lng:149.1653};
//9
const defaultZoom = 19.5;

const initState = {
    loading: false,
    limit: 50,
    missions: [],
    missionDropDowns: [],
    locations: [],
    mission: null,
    zoom: defaultZoom,
    center: defaultCenter,
    errorName: false,
    errorDistance: false,
    draggable: true,
    hidePopup: false,
    updated: false,
    newMission: false,
    inputName: "",
    added: false,
    // delete drone
    droneStatus: null,
};

class MissionM extends Component {
    constructor(props) {
        super(props);

        this.state = initState;


        this.handleAllowedToggle = this.handleAllowedToggle.bind(this);
    }

    handleAllowedToggle = (mission) => {

        mission.isAllowed = !mission.isAllowed;
        let index = this.state.missions.findIndex((i) => i.uid === mission.uid);

        let newMissions = [...this.state.missions];

        newMissions.splice(index, 1, mission);

        this.setState({missions: newMissions});

        this.props.firebase.mission(mission.uid).update({
            isAllowed: mission.isAllowed
        });

    };


    componentDidMount() {
        this.onListenForMissionsDatabase();
        // delete drone
        this.onListenForDroneStatus();
    }

    // delete drone
    onListenForDroneStatus = () => {
        this.props.firebase
            .droneStatus()
            .on("value", snapshot => {
                const droneStatus = snapshot.val();

                if (droneStatus) {
                    this.setState({
                        droneStatus: droneStatus,
                    });
                } else {
                    this.setState({
                        droneStatus: null,
                    });
                }
            });
    };

    testMapAPI = null;
    testMap = null;
    oldPath = null;

    passMapReference(map, maps) {
        this.testMap = map;
        this.testMapAPI = maps;
    }

    renderPolylines(locations) {

        let maps = this.testMapAPI;

        let locs = locations.map(l => {
            return ({lat: l.latitude, lng: l.longitude})
        });

        if (this.oldPath) {
            this.oldPath.setMap(null);
        }

        this.oldPath = new maps.Polyline({
            path: locs,
            strokeColor: '#f44336',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillOpacity: 0,
            map: this.testMap,
        });


    }

    onListenForMissionsDatabase = () => {
        this.setState({loading: true});
        this.props.firebase
            .missions()
            .orderBy("name", "desc")
            .get().then(snapshot => {
            snapshot.forEach(doc => {
                const missionObject = doc.data();

                if (missionObject) {
                    const mission = {
                        ...missionObject,
                        uid: doc.id,
                    };

                    const missionDropDown = {
                        key: doc.id,
                        text: mission.name,
                        value: doc.id,
                    };

                    this.setState({
                        missions: [mission, ...this.state.missions],
                        missionDropDowns: [missionDropDown, ...this.state.missionDropDowns],
                        loading: false,
                    });


                } else {
                    this.setState({missions: null, missionDropDowns: null, loading: false});
                }
            })
        });

    };

    handleMapClick =  (map) => {

        if(!this.state.mission && !this.state.newMission){
            return;
        }

        const location = {latitude: map.lat, longitude: map.lng};
         this.setState(prevState => ({
            locations: [...prevState.locations, location],
        }), this.locationDistanceUpdate);
    };

    handleChildClick =  (lat, lng) => {
        const newState = [...this.state.locations];
        const index = newState.findIndex(i => i.latitude === lat && i.longitude === lng);
        newState.splice(index, 1);
         this.setState({
            locations: newState,
        }, this.locationDistanceUpdate);
    };

    locationDistanceUpdate = () => {
        const {locations} = this.state;

        let sum_distance = 0;
        let length = locations.length;
        for (let i = 0; i < length - 1; i++) {
            sum_distance += getDistance({latitude: locations[i].latitude, longitude: locations[i].longitude},
                {latitude: locations[i + 1].latitude, longitude: locations[i + 1].longitude}, 1);
        }
        this.setState({distance: ((sum_distance *= 2) / 1000.0).toFixed(2)});

        this.renderPolylines(locations);
    };

    missionCenter = (mission) => {
        if (!mission) {
            return defaultCenter;
        }

        let long = 0;
        let lat = 0;
        mission.route.forEach(r => {
            long += r.longitude;
            lat += r.latitude;
        });
        return {lat: lat / mission.route.length, lng: long / mission.route.length};
    };

    missionZoom = (mission) => {
        if (!mission) {
            return defaultZoom;
        }

        let zoom = defaultZoom;

        if (mission.distance > 0) {
            zoom = 19.5;
        }

        if (mission.distance > 1) {
            zoom = 15;
        }
        if (mission.distance > 2) {
            zoom = 14;
        }
        if (mission.distance > 4) {
            zoom = 13;
        }
        if (mission.distance > 8) {
            zoom = 12;
        }

        return zoom + 0.5;
    };

    submitMe = () => {

        this.setState({errorName: false, errorDistance: false});

        const {mission, inputName, locations, distance} = this.state;

        if (inputName.length < 1 || distance > 9.5) {
            if (inputName.length < 1) {
                this.setState({errorName: true});
            }
            if (distance > 9.5) {
                this.setState({errorDistance: true});
            }
            //setTimeout(() => this.setState({errorName: false, errorDistance: false}), 2000);
            return;
        }

        const missionRoute = locations.map((item) => {
            return {latitude: item.latitude, longitude: item.longitude}
        });

        if (mission) {
            let newMission = {
                uid: mission.uid,
                name: inputName,
                route: missionRoute,
                distance: distance,
                flightTime: ((distance * 1000) / 480).toFixed(0),
                editedBy: this.props.firebase.auth.currentUser.email,
                editedAt: new Date().toDateString(),
                isAllowed: mission.isAllowed,
            };

            this.setState({
                updated: true
            });

            this.props.firebase.mission(mission.uid).update(newMission);

            setTimeout(() => {
                this.setState(initState);
                this.renderPolylines([]);
                this.onListenForMissionsDatabase();
            }, 1500);

        } else {

            let newMission = {
                name: inputName,
                route: missionRoute,
                distance: distance,
                flightTime: ((distance * 1000) / 480).toFixed(0),
                createdAt: new Date().toDateString(),
                createdBy: this.props.firebase.auth.currentUser.email,
                editedAt: null,
                editedBy: null,
                isAllowed: true,
            };

            this.props.firebase.missions().add(newMission);

            this.setState({
                added: true
            });

            setTimeout(() => {
                this.setState(initState);
                this.renderPolylines([]);
                this.onListenForMissionsDatabase();
            }, 1500);
        }
    };

    updateSelected = (event, {selected, value}) => {

        const index = this.state.missions.findIndex(i => i.uid === value);
        const mission = this.state.missions[index];

        let missionRoute = [];
        let missionName = "";
        let missionDistance = 0;

        if (mission) {
            missionRoute = mission.route.map((item) => {
                return {latitude: item.latitude, longitude: item.longitude}
            });
            missionName = mission.name;
            missionDistance = mission.distance;
        }

        this.setState({
            mission: mission,
            locations: missionRoute,
            inputName: missionName,
            submitName: missionName,
            distance: missionDistance,
            errorName: false,
            errorDistance: false,
            draggable: true,
            hidePopup: false,
            center: this.missionCenter(mission),
            zoom: this.missionZoom(mission, false),
        });

        this.renderPolylines(mission.route);

    };

    onCircleInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            hidePopup: true,
        });

        const newState = [...this.state.locations];
        newState.splice(childProps.id, 1, {latitude: mouse.lat, longitude: mouse.lng});
        this.setState({
            locations: newState,
        }, this.locationDistanceUpdate);

    };

    handleChange = (e, {value}) => this.setState({inputName: value});

    addNewMission = () => {
        this.setState({
            locations: [],
            mission: null,
            distance: 0,
            inputName: "",
            zoom: defaultZoom,
            center: defaultCenter,
            newMission: true,
        });

        this.renderPolylines([]);

    };

    render() {
        // delete drone
        const {droneStatus,mission, locations, missionDropDowns, loading, newMission} = this.state;
        const {updated, inputName, distance, errorName, errorDistance, added} = this.state;
        return (
            <Grid columns={2}>
                <Grid.Column width={4}>
                    {(!loading) ?
                        <Grid columns={2}>
                            <Grid.Column width={13}>
                                <Dropdown fluid scrolling
                                          className="h2"
                                          search selection
                                          onChange={this.updateSelected}
                                          text={mission ? mission.name : newMission ? "New Mission" : "Select Mission"}
                                          options={missionDropDowns}/>
                            </Grid.Column>
                            <Grid.Column width={2} style={{paddingLeft: "0.5em"}}>
                                <Popup content='Add New Mission'
                                       trigger={<Button size="huge" positive icon='add'
                                                        onClick={this.addNewMission}/>}/>
                            </Grid.Column>
                        </Grid>
                        : (<Loading size={100}/>)}
                    {
                        ((mission || newMission) && (
                            <Card fluid>
                                <Card.Content>
                                    {(errorName || errorDistance) && (<Message error>
                                        <Message.Header>Error</Message.Header>
                                        {errorName && <Message.Content>Please enter mission name</Message.Content>}
                                        {errorDistance &&
                                        <Message.Content>Round trip must be less than 9.6 KM</Message.Content>}
                                    </Message>)}
                                    <Form onSubmit={this.submitMe}>
                                        {mission &&
                                        <Segment>
                                            <h3 style={{textAlign: "center"}}>{mission.isAllowed ? "Mission is Enabled" : "Mission is Disabled"}</h3>
                                            <Button size="medium" content={mission.isAllowed ? "Disable" : "Enable"}
                                                    fluid color={mission.isAllowed ? "grey" : "green"}
                                                    onClick={() => this.handleAllowedToggle(mission)}>

                                            </Button>
                                        </Segment>
                                        }
                                        <Segment>
                                            <h4>Mission Name</h4>
                                            <Form.Input
                                                onChange={this.handleChange}
                                                value={inputName}
                                                error={errorName}
                                            />
                                        </Segment>

                                        <Segment.Group horizontal>
                                            <Segment>
                                                <h3>{distance} KM</h3>
                                                Round Trip
                                            </Segment>
                                            <Segment>
                                                <h3>{((distance * 1000) / 480).toFixed(0)} Minutes</h3>
                                                Flight Time
                                            </Segment>
                                            <Segment>
                                                <h3> {locations.length}</h3>
                                                Waypoints
                                            </Segment>
                                        </Segment.Group>

                                        <Segment.Group horizontal>
                                            <Segment>
                                                <h3 style={{marginBottom:"5px"}}>Created</h3>
                                                {mission && mission.createdBy ? mission.createdBy : "None"}<br/>
                                                {mission && mission.createdAt ? mission.createdAt : "None"}<br/>
                                            </Segment>
                                            <Segment>
                                                <h3 style={{marginBottom:"5px"}}>Edited</h3>
                                                {mission && mission.editedBy ? mission.editedBy : "None"}<br/>
                                                {mission && mission.editedAt ? mission.editedAt : "None"}<br/>
                                            </Segment>
                                        </Segment.Group>
                                        <Form.Button fluid primary
                                                     content={newMission ? "Add New Mission" : 'Update Mission'}/>
                                    </Form>
                                </Card.Content>
                                {(updated && <Card.Content extra>
                                    <Message info icon>
                                        <Icon name='info'/>
                                        <Message.Content>
                                            <Message.Header>Mission Updated, Reloading.</Message.Header>
                                        </Message.Content>
                                    </Message>
                                </Card.Content>)}
                                {(added && <Card.Content extra>
                                    <Message info icon>
                                        <Icon name='info'/>
                                        <Message.Content>
                                            <Message.Header>New Mission Added, Reloading.</Message.Header>
                                        </Message.Content>
                                    </Message>
                                </Card.Content>)}
                            </Card>
                        ))}
                </Grid.Column>
                <Grid.Column width={12}>
                    <Card fluid>
                        <Container style={mapBorder}>
                            <GoogleMapReact
                                bootstrapURLKeys={MAPS_CONFIG}
                                options={{mapTypeControl: true, mapTypeId: "satellite",tilt:0}}
                                center={this.missionCenter(mission)}
                                zoom={this.missionZoom(mission)}
                                onChildMouseDown={() => this.setState({
                                    draggable: !this.state.draggable,
                                    hidePopup: false
                                })}
                                onChildMouseUp={() => this.setState({
                                    draggable: !this.state.draggable,
                                    hidePopup: false
                                })}
                                onChildMouseMove={this.onCircleInteraction}
                                onClick={this.handleMapClick}
                                draggable={this.state.draggable}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({map, maps}) => this.passMapReference(map, maps)}
                            >
                                {locations && locations.map((location, index) => {
                                    return (<MyGreatPlace
                                        hide={this.state.hidePopup}
                                        lat={location.latitude} lng={location.longitude} key={`marker-${index}`}
                                        id={index}
                                        text={index + 1}
                                        handleRightClick={this.handleChildClick}
                                    />);
                                })}
                            </GoogleMapReact>
                        </Container>
                    </Card>
                </Grid.Column>
            </Grid>
        );
    }
}

export default withFirebase(MissionM);
