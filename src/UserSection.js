import React from 'react';
import {getUser, handleErrors} from "./utils";
import UpdatePassword from "./UpdatePassword";
import check from "./img/check.svg";
import cross from "./img/times.svg";


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
                console.log('response', response);
                return response.json()
            })
            .then((json) => {
                console.log('json', json);
                if(json.code === 200) {
                    console.log('json', json);
                    this.setState({ assignments: json.steps, uploads: json.uploads});
                }
            }).catch((error) =>  {
            console.log('error', error);
        })
    }

    render() {
        const {user, changePassword, assignments, uploads} = this.state;
        return (
            <div className="user-section">
                <div className="user-section__info">
                    <p>Användarnamn: {user.email}</p>
                    <button onClick={() => {this.setState({changePassword: !changePassword})}}>Ändra lösenord</button>
                    { changePassword &&
                    <UpdatePassword userEmail={user.email}   />
                    }
                </div>
                <div className="user-section__assignments">
                    <h3>Inlämnade uppgifter</h3>

                    {assignments &&
                    assignments.map((assignment) => (
                        <div key={assignment.step} className="assignments-row">
                            <div>{assignment.title}</div>
                            {uploads.includes(assignment.step) ?
                                <div className="check">
                                    <img src={check} alt="check-mark"/>
                                </div> :
                                <div className="cross">
                                    <img src={cross} alt="cross-mark"/>
                                </div>
                            }
                        </div>
                    ))
                    }

                </div>
            </div>
        )
    }
}

