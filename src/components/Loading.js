import React from 'react';
import {Dimmer, Grid, Loader, Segment} from "semantic-ui-react";

const Loading = props => {

    const {size} = props;

    return (
        <Grid.Column>
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted size="large">Loading</Loader>
                </Dimmer>
                <div style={{minWidth: size, minHeight: size}}/>
            </Segment>
        </Grid.Column>
    );
};


export default Loading;
