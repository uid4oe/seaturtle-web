import React from "react";
import {Modal} from "semantic-ui-react";
import Image from "semantic-ui-react/dist/commonjs/elements/Image";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import {MAPS_CONFIG} from "../../config";


const mapBorder = {width: "100% ", height: "75vh "};


function PictureMapModal(props) {

    const {picture} = props;

    const marker = <MyGreatPlace
        lat={picture.location.latitude} lng={picture.location.longitude}
        picture={picture}/>;

    return (
        <Modal trigger={<Image fluid src={picture.thumbnail}/>} closeIcon>
            <Modal.Content style={mapBorder}>
                <GoogleMapReact
                    bootstrapURLKeys={MAPS_CONFIG}
                    defaultCenter={{lat: picture.location.latitude, lng: picture.location.longitude}}
                    defaultZoom={16}>
                    {marker}
                </GoogleMapReact>
            </Modal.Content>
        </Modal>
    );
}

export default PictureMapModal;
