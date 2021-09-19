import React, {Component} from "react";


import {Icon, Menu, Message, Tab} from "semantic-ui-react";
import MissionHistoryModal from "./MissionHistoryModal";
import {withFirebase} from "../../components/Firebase";
import Loading from "../../components/Loading";

class MissionH extends Component {
    constructor(props) {
        super(props);

        this.state = {
            missions: [],
            empty: false,
        }
    }


    getMissionDetails = (mid) => {
        return this.props.firebase
            .mission(mid)
            .get().then(doc => {
                return doc.data();
            });
    };

    onListenForMissionHistoriesDatabase = () => {
        this.setState({empty: false, missions: []});
        this.props.firebase
            .missionHistories()
            .orderBy("started_at", "desc")
            .get().then(snapshot => {
            snapshot.forEach(async doc => {
                const missionObject = doc.data();

                if (missionObject && missionObject["uploaded-images"]) {

                    const images = Object.keys(missionObject["uploaded-images"]).map(key => ({
                        ...missionObject["uploaded-images"][key],
                    }));

                    missionObject["uploaded-images"] = images;

                    const mission = {
                        ...missionObject,
                        uid: doc.id,
                    };

                    mission.details = await this.getMissionDetails(mission.mission_ref);

                    this.setState({
                        missions: [...this.state.missions, mission],
                    });

                }
                else{
                    this.setState({empty: true});
                }
            });
            if (snapshot.empty)
                this.setState({empty: true});
        });

    };

    componentDidMount() {
        this.onListenForMissionHistoriesDatabase();
    }

    render() {
        const {missions, empty} = this.state;

        return (
            missions.length > 0 ?
                <Tab
                    grid={{paneWidth: 14, tabWidth: 2,style:{display:"inline"}}}
                    menu={{vertical: true, fluid: true,style:{overflow: 'auto', maxHeight: '700px' }}}
                    menuPosition='left'
                    panes={missions.map((mission, index) => {
                        return ({
                            menuItem: <Menu.Item style={{borderLeftStyle: "solid",margin:"0"}}>{mission.details.name}<h5>{new Date(mission.started_at).toLocaleTimeString()}</h5></Menu.Item>,
                            render: () =>
                                <Tab.Pane key={"active-" + index}>
                                    <MissionHistoryModal mission={mission}
                                                         refresh={() => this.onListenForMissionHistoriesDatabase()}/>
                                </Tab.Pane>
                        })
                    })}
                />
                : empty ? <Message info icon>
                    <Icon name='warning sign'/>
                    <Message.Content>
                        <Message.Header>No Results.</Message.Header>
                        Please complete a mission first.
                    </Message.Content>
                </Message>
                : <Loading size={100}/>

        );
    }
}

export default withFirebase(MissionH);
