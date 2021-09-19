import React from "react";

import {withFirebase} from "../../components/Firebase";

import {Grid, Tab,} from "semantic-ui-react";
import CommandCard from "./CommandCard";
import PictureMap from "./PictureMap";
import PictureCard from "./PictureCard";


function FirstDemo(props) {
    const panes = [
        {
            menuItem: "Map",
            pane: (<Tab.Pane>
                <PictureMap pictureMap={true} {...props}/>
            </Tab.Pane>),
        },
        {
            menuItem: "Picture Grid",
            pane: (<Tab.Pane>
                <PictureCard {...props} rows={3}/>
            </Tab.Pane>),
        },


    ];

    return (
        <Grid columns={2}>
            <Grid.Column width={4}>
                <CommandCard {...props}/>
            </Grid.Column>
            <Grid.Column width={12}>
                <Tab panes={panes} renderActiveOnly={false}/>
            </Grid.Column>
        </Grid>
    );
}

export default withFirebase(FirstDemo);
