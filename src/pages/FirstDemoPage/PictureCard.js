import React, {Component} from "react";
import PictureList from "./PictureList";


import {Loader, Message,} from "semantic-ui-react";

class PictureCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            pictures: [],
            limit: 50,
        };
    }

    componentDidMount() {
        this.onListenForPictures();
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
        const {loading, pictures} = this.state;

        return (
            <>
                {loading && <Loader active inline="centered"/>}
                {pictures && (
                    <PictureList
                        pictures={pictures}
                        onCancelCommand={this.onCancelCommand}
                        onClearCommand={this.onClearCommand}
                        rows={5}
                    />
                )}
                {!loading && !pictures && (
                    <Message info>
                        <p>There are no pictures...</p>
                    </Message>
                )}
            </>
        );
    }
}

export default PictureCard;
