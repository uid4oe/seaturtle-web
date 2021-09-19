import React, {Component} from "react";
import {Button, Card, Container, Dropdown, Grid, Loader} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import MissionCard from "./MissionCard";
import {withFirebase} from "../../components/Firebase";
import {MAPS_CONFIG} from "../../config";
import DroneStatusCard from "../../components/DroneStatusCard";

const mapBorder = {width: "100% ", height: "80vh"};

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 9;

class MissionS extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            limit: 50,
            missions: [],
            missionDropDowns: [],
            locations: [],
            selectedMission: null,
            zoom: defaultZoom,
            center: defaultCenter,
            activeMission: null,
            resultMission: null,
            droneStatus: null,
            last_online: 0,
        };
    }

    componentDidMount() {
        this.onListenForMissionsDatabase();
        this.onListenForActiveMission();
        this.onListenForPiStatus();
        this.onListenForDroneStatus();
    }

    testMapAPI = null;
    testMap = null;
    oldPath = null;

    passMapReference(map, maps) {
        this.testMap = map;
        this.testMapAPI = maps;
    }

    renderPolylines(locations) {

        let maps = this.testMapAPI;

        if (maps) {
            let locs = locations.map(l => {
                return ({lat: l.latitude, lng: l.longitude})
            });

            if (this.oldPath != null) {
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

    }

    onListenForDroneStatus = () => {
        this.props.firebase
            .droneStatus()
            .on("value", snapshot => {
                const droneStatus = snapshot.val();

                droneStatus.status = new Date() - this.state.last_online < 5500;

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

    onListenForPiStatus = () => {
        this.props.firebase
            .piStatus()
            .on("value", snapshot => {
                const piStatus = snapshot.val();

                if (piStatus) {
                    this.setState({
                        last_online: piStatus.last_online,
                    });
                } else {
                    this.setState({
                        last_online: 0,
                    });
                }
            });
    };

    onListenForActiveMission = () => {
        this.props.firebase
            .activeMission()
            .on("value", async snapshot => {
                const activeMission = snapshot.val();

                if (activeMission && activeMission.mission_state !== "Finished") {

                    let mission = await this.getMissionDetails(activeMission.mission_ref);

                    let images = [];
                    if (activeMission["uploaded-images"]) {
                        images = Object.keys(activeMission["uploaded-images"]).map(key => ({
                            ...activeMission["uploaded-images"][key],
                        }));
                    }

                    mission.started_at = activeMission.started_at;
                    mission.waypoints = activeMission.waypoints;
                    mission.mission_log = activeMission.mission_log;
                    mission.state = activeMission.mission_state ? activeMission.mission_state : "Pending";
                    mission.picturesTaken = images.length;
                    mission["uploaded-images"] = images;


                    this.setState({
                        activeMission: mission,
                        selectedMission: mission,
                        resultMission: null,
                        center: this.missionCenter(mission),
                        zoom: this.missionZoom(mission, true),
                    });

                    this.renderPolylines([]);
                    this.renderPolylines(mission.route);


                } else if (this.state.selectedMission && activeMission && activeMission.mission_state === "Finished") {

                    await new Promise(r => setTimeout(r, 2000));

                    this.onListenForMissionHistoriesDatabase();
                };
            });
    };

    onListenForMissionsDatabase = () => {
        this.setState({missions: [], missionDropDowns: [], loading: true});
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

                    if (mission.isAllowed) {
                        this.setState({
                            missions: [mission, ...this.state.missions],
                            missionDropDowns: [missionDropDown, ...this.state.missionDropDowns],
                            loading: false,
                        });
                    }

                } else {
                    this.setState({missions: null, missionDropDowns: null, loading: false});
                }
            })
        });

    };

    onListenForMissionHistoriesDatabase = async () => {
        await this.props.firebase
            .missionHistories()
            .orderBy("started_at", "desc")
            .get().then(async snapshot => {
                    if (!snapshot.empty) {
                        const missionObject = snapshot.docs[0].data();

                        if (missionObject && missionObject["uploaded-images"]) {

                            missionObject["uploaded-images"] = Object.keys(missionObject["uploaded-images"]).map(key => ({
                                ...missionObject["uploaded-images"][key],
                            }));

                            const mission = {
                                ...missionObject,
                            };

                            mission.details = await this.getMissionDetails(mission.mission_ref);

                            this.renderPolylines([]);

                            this.setState({
                                resultMission: mission,
                                activeMission: null,
                                selectedMission: null,
                                center: this.missionCenter(mission.details),
                                zoom: this.missionZoom(mission.details,true)
                            });
                        }
                    }
                }
            );


    };

    getMissionDetails = (mid) => {
        return this.props.firebase
            .mission(mid)
            .get().then(doc => {
                let details = doc.data();
                if (details) {
                    details.uid = mid;
                    return details;
                }
            });
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

    missionZoom = (mission, isActive) => {

        if (!mission) {
            return defaultZoom;
        }

        let zoom = defaultZoom;

        if (mission.distance > 0) {
            zoom = 20;
        }

        if (mission.distance > 1) {
            zoom = 17;
        }
        if (mission.distance > 2) {
            zoom = 16;
        }
        if (mission.distance > 4) {
            zoom = 15;
        }
        if (mission.distance > 8) {
            zoom = 14;
        }
        return isActive ? zoom + 1 : zoom;
    };

    updateSelected = (event, {selected, value}) => {

        const index = this.state.missions.findIndex(i => i.uid === value);

        const mission = this.state.missions[index];

        this.setState({
            selectedMission: mission,
            center: this.missionCenter(mission),
            zoom: this.missionZoom(mission, false),
        });

        this.renderPolylines([]);
        this.renderPolylines(mission.route);

    };

    componentWillUnmount() {
        this.props.firebase
            .droneStatus().off();
        this.props.firebase
            .activeMission().off();
    }

    handleStartMission = () => {

        const {selectedMission} = this.state;

        if (selectedMission) {
            const waypoints = selectedMission.route.map(w => {
                return {altitude: 5, latitude: w.latitude, longitude: w.longitude}
            });

            const activeMission = {
                mission_ref: selectedMission.uid,
                acknowledged: false,
                waypoints
            };

            this.props.firebase.activeMission().set(activeMission);

            this.setState({
                zoom: this.missionZoom(selectedMission, true),
                center: this.missionCenter(selectedMission),
                activeMission: selectedMission,
                resultMission: null,
            });
        }
    };

    handleClearResults = () => {
        this.setState({
            activeMission: null,
            selectedMission: null,
            resultMission: null,
            zoom: defaultZoom,
            center: defaultCenter,
        });
        this.renderPolylines([]);
        this.onListenForMissionsDatabase();

    };

    render() {

        const {droneStatus, selectedMission, missionDropDowns, loading, activeMission, zoom, center, resultMission} = this.state;

        return (
            <Grid columns={2}>
                <Grid.Column width={4}>
                    {(!loading) ? (!activeMission && !resultMission) ?
                        <Dropdown fluid scrolling
                                  className="h2"
                                  search selection
                                  onChange={this.updateSelected}
                                  text={selectedMission ? selectedMission.name : "Select Mission"}
                                  options={missionDropDowns}/>
                        :
                        <Dropdown fluid
                                  className="h2"
                                  search selection
                                  disabled
                                  text={activeMission ? activeMission.name : resultMission.details.name}/>
                        : (<Loader active inline="centered"/>)}
                    {activeMission ?
                        <>
                            <MissionCard activeMission mission={activeMission}/>
                            <DroneStatusCard drone={droneStatus}/>
                        </>
                        : selectedMission ? <>
                                <MissionCard selectedMission mission={selectedMission}/>
                                <DroneStatusCard drone={droneStatus}/>
                                <Card.Content extra>
                                    <Button disabled={droneStatus && !droneStatus.status} fluid positive
                                            onClick={this.handleStartMission}>Start
                                        Mission</Button>
                                </Card.Content>
                            </>
                            : resultMission && <>
                            <MissionCard resultMission mission={resultMission}/>
                            <DroneStatusCard drone={droneStatus}/>
                            <Card.Content extra>
                                <Button.Group fluid>
                                    <Button positive
                                            onClick={this.handleClearResults}>Clear
                                        Mission</Button>
                                </Button.Group>
                            </Card.Content>
                        </>}
                </Grid.Column>
                <Grid.Column width={12}>
                    <Card fluid>
                        <Container style={mapBorder}>
                            <GoogleMapReact
                                bootstrapURLKeys={MAPS_CONFIG}
                                center={center}
                                zoom={zoom}
                                options={{mapTypeControl: true, mapTypeId: "satellite",tilt:0}}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({map, maps}) => this.passMapReference(map, maps)}
                            >
                                {selectedMission && selectedMission.route.map((location, index) => {
                                    return (<MyGreatPlace
                                        lat={location.latitude} lng={location.longitude} id={location.id}
                                        text={index + 1}
                                    />);
                                })}
                                {!resultMission && droneStatus && <MyGreatPlace drone
                                                                                lat={droneStatus.location.latitude}
                                                                                lng={droneStatus.location.longitude}
                                                                                id={"Drone Marker"}
                                                                                text={"Drone"}
                                />
                                }
                                {!activeMission && resultMission && resultMission["uploaded-images"].map((p, index) => {
                                    return (<MyGreatPlace
                                        isPicture
                                        picture={p}
                                        lat={p.location.latitude} lng={p.location.longitude}
                                        id={p.location.id}
                                        imageThumb={p.thumbnail} imageSource={p.source}
                                        text={index + 1} size={"large"}
                                    />);
                                })}
                                {activeMission && activeMission["uploaded-images"] && activeMission["uploaded-images"].map((p, index) => {
                                    return (<MyGreatPlace isPicture
                                                          picture={p}
                                                          lat={p.location.latitude} lng={p.location.longitude}
                                                          id={p.location.id}
                                                          imageThumb={p.thumbnail} imageSource={p.source}
                                                          text={index + 1} size={"large"}
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

export default withFirebase(MissionS);
