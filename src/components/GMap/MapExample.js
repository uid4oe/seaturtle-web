import React, {Component} from "react";
import {Card, Container} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "../../pages/MissionManagementPage/Marker";
import {getDistance} from "geolib";
import {MAPS_CONFIG} from "../../config";

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 11;

const mapBorder = {width: "100% ", height: "75vh "};

class MapExample extends Component {
    constructor(props) {
        super(props);

        let missionRoute = [];
        let missionName = "";
        let missionDistance = 0;

        if (this.props.mission) {
            missionRoute = this.props.mission.route.map((item) => {
                return {latitude: item.latitude, longitude: item.longitude}
            });
            missionName = this.props.mission.name;
            missionDistance = this.props.mission.distance;
        }

        this.state = {
            mission: this.props.mission,
            locations: missionRoute,
            inputName: missionName,
            submitName: missionName,
            distance: missionDistance,
            errorName: false,
            errorDistance: false,
            draggable: true,
            hidePopup: false,
        };

    }


    handleMapClick = async (map) => {
        const location = {latitude: map.lat, longitude: map.lng};
        await this.setState(prevState => ({
            locations: [...prevState.locations, location],
        }), this.locationDistanceUpdate);
    };

    handleChildClick = async (lat,lng) =>{
        const newState = [...this.state.locations];
        const index = newState.findIndex(i => i.latitude === lat && i.longitude === lng);
        newState.splice(index, 1);
        await this.setState({
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

        return zoom + 1;
    };

    testMapAPI = null;
    testMap = null;
    oldPath = null;

    passMapReference(map, maps) {
        this.testMap = map;
        this.testMapAPI = maps;

        this.renderPolylines(this.state.locations);
    }

    renderPolylines(locations) {

        let maps = this.testMapAPI;

        let locs = locations.map(l => {
            return ({lat: l.latitude, lng: l.longitude})
        });

        if (this.oldPath != null) {
            this.oldPath.setMap(null);
        }

        this.oldPath = new maps.Polygon({
            path: locs,
            strokeColor: '#f44336',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillOpacity: 0,
            map: this.testMap,
        });


    }

    onCircleInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            hidePopup:true,
        });

        const newState = [...this.state.locations];
        newState.splice(childProps.id, 1, {latitude: mouse.lat, longitude: mouse.lng});
        this.setState({
            locations: newState,
        }, this.locationDistanceUpdate);

    };

    handleChange = (e, {value}) => this.setState({inputName: value});

    render() {
        const {mission, locations} = this.state;

        return (
                <Card fluid>
                    <Container style={mapBorder}>
                        <GoogleMapReact
                            bootstrapURLKeys={MAPS_CONFIG}
                            options={{mapTypeControl:true,mapTypeId:"terrain"}}
                            center={this.missionCenter(mission)}
                            zoom={this.missionZoom(mission)}
                            onChildMouseDown={async () => await this.setState({draggable: !this.state.draggable,hidePopup:false})}
                            onChildMouseUp={async () => await this.setState({draggable: !this.state.draggable,hidePopup:false})}
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
                </Card>);
    }
}


export default MapExample;
