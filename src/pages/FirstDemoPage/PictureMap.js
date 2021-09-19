import React, {Component} from "react";
import {Card, Container, Grid, Loader, Message} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import CommandList from "./CommandList";
import {MAPS_CONFIG} from "../../config";


const mapBorder = {width: "100% ", height: "75vh "};

class PictureMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            pictures: null,
            picture: {},
            locations: [],
        };
    }

    componentDidMount() {
        if (this.props.pictureMap) {
            this.onListenForPictures();
        }
    }

    onListenForPictures = () => {
        this.setState({loading: true});

        this.props.firebase
            .imagesRef()
            .orderByChild("createdAt")
            .on("value", snapshot => {
                const pictureObject = snapshot.val();

                if (pictureObject) {
                    const pictureList = Object.keys(pictureObject).map(key => ({
                        ...pictureObject[key],
                        uid: key,
                    }));

                    this.setState({
                        pictures: pictureList.reverse(),
                        loading: false,
                    });

                } else {
                    this.setState({pictures: null, loading: false});
                }
            });

    };

    render() {

        const {locations, loading} = this.state;

        return (
            !this.props.pictureMap ?
                <Grid columns={2}>
                    <Grid.Column width={4}>
                        <Card fluid={true}>
                            <Card.Content>
                                <Card.Description>
                                    {loading && <Loader active inline="centered"/>}
                                    {locations && (
                                        <CommandList
                                            locations={this.state.locations}
                                            onCancelCommand={this.onCancelCommand}
                                            onClearCommand={this.onClearCommand}
                                        />
                                    )}
                                    {locations.length === 0 && (
                                        <Message info>
                                            <p>There are no markers ...</p>
                                        </Message>
                                    )}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Card fluid>
                            <Container style={mapBorder}>
                                <GoogleMapReact
                                    bootstrapURLKeys={MAPS_CONFIG}
                                    defaultCenter={{lat: 35.33, lng: 33.33}}
                                    defaultZoom={12}
                                >
                                    {locations && locations.map((location, index) => {
                                        return (<MyGreatPlace
                                            lat={location.lat} lng={location.lng} id={location.id} text={index + 1}
                                        />);
                                    })}
                                </GoogleMapReact>
                            </Container>
                        </Card>
                    </Grid.Column>
                </Grid>
                :
                <Card fluid>
                    <Container style={mapBorder}>
                        <GoogleMapReact
                            bootstrapURLKeys={MAPS_CONFIG}
                            defaultCenter={{lat: 35.24871, lng: 33.020869}}
                            defaultZoom={17}
                        >
                            {this.state.pictures != null ? this.state.pictures.map((picture, index) => (
                                <MyGreatPlace key={index}
                                              lat={picture.location.latitude}
                                              lng={picture.location.longitude}
                                              id={index}
                                              picture={picture}>
                                </MyGreatPlace>)) : <div/>
                            }
                        </GoogleMapReact>
                    </Container>
                </Card>
        );
    }
}

export default PictureMap;
