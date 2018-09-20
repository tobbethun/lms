import React from 'react';
import {getUser, handleErrors} from "./utils";
import UpdatePassword from "./UpdatePassword";
import check from "./img/check.svg";


export class UserSection extends React.Component {
    constructor() {
        super();
        this.state = {
            changePassword: false,
            user: getUser(),
            assignments: []
        };
    }

    componentDidMount() {
        this.progress();
    }

    progress() {
        fetch('/api/assignments', {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: this.state.user.email,
                })
            })
            .then(handleErrors)
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                if(json.code === 200) {
                    this.setState({ assignments: json.steps, uploads: json.uploads});
                }
            })
            .catch(() =>  {
                this.setState({noNetworkMessage: 'Ingen kontakt med servern. Kontrollera din internetuppkoppling.'});
            })
    }

    render() {
        const {user, changePassword, assignments, uploads, noNetworkMessage} = this.state;
        return (
            <div className="user-section">
                <div className="user-section__info">
                    <h3>Användare</h3>
                    <p>Användarnamn: {user.email}</p>
                    <button onClick={() => {this.setState({changePassword: !changePassword})}} className="change-passwordx">Ändra lösenord</button>
                    { changePassword &&
                    <UpdatePassword userEmail={user.email}   />
                    }
                </div>
                <div className="user-section__assignments">
                    {noNetworkMessage && <div className="info-box">{noNetworkMessage}</div>}
                    <h3>Inlämnade uppgifter</h3>

                    {assignments &&
                    assignments.map((assignment) => (
                        <div key={assignment.step} className="assignments-row">
                            <div>{assignment.title}</div>
                            {uploads.indexOf(assignment.step) > -1 ?
                                <div className="check">
                                    <img src={check} alt="check-mark"/>
                                </div> :
                                <div className="cross"/>
                            }
                        </div>
                    ))
                    }

                </div>
            </div>
        )
    }
}

