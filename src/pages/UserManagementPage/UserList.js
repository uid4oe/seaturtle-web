import React, {Component} from "react";

import {withFirebase} from "../../components/Firebase";


import {Card, Dropdown, Icon, Message, Table} from "semantic-ui-react";
import Loading from "../../components/Loading";

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            empty: false,
            users: [],
            userDropdownOptions: [{key: 1, text: "Admin", value: "Admin"},
                {key: 2, text: "Expert", value: "Expert"},
                {key: 3, text: "Operator", value: "Operator"},],
        };

        this.updateSelected = this.updateSelected.bind(this);
    }

    onListenForDatabase = () => {
        this.setState({empty: false, users: []});
        this.props.firebase
            .users()
            .get().then(snapshot => {
            snapshot.forEach(doc => {
                const userObject = doc.data();

                if (userObject) {
                    const user = {
                        ...userObject,
                        uid: doc.id,
                    };

                    this.setState({
                        users: [user, ...this.state.users],
                        loading: false,
                    });

                }
            });
            if (snapshot.empty) {
                this.setState({loading: false, empty: true});
            }
        });

    };

    componentDidMount() {
        this.onListenForDatabase();
    }

    updateSelected = (user, value) => {
        this.props.firebase.user(user.uid).update(
            {
                role: value
            }).then(this.onListenForDatabase);
    };


    render() {
        const {users, userDropdownOptions, empty} = this.state;

        return (users.length > 0 ? (
                <Card fluid>
                    <Card.Content>
                        <Table celled compact>
                            <Table.Header fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Role</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {users && users.map((user, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell collapsing>
                                            <Dropdown fluid scrolling
                                                      className="h2"
                                                      selection
                                                      onChange={() => this.updateSelected(user, getSelection().anchorNode.textContent)}
                                                      text={user.role}
                                                      options={userDropdownOptions}/>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Card.Content>
                </Card>
            ) : empty ?
                <Message info icon>
                    <Icon name='warning sign'/>
                    <Message.Content>
                        <Message.Header>No Results.</Message.Header>
                        Please add a user first.
                    </Message.Content>
                </Message>
                :
                <Loading size={100}/>

        )
            ;
    }
}

export default withFirebase(UserList);


//                                                <Table.Cell>{mission.route.map((point, index) => <Button size="tiny"
//                                                     key={index}>{point.latitude.toFixed(2)},{point.longitude.toFixed(2)}</Button>)}</Table.Cell>
