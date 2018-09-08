import React from 'react';
import {getUser, handleErrors} from "./utils";
import UpdatePassword from "./UpdatePassword";


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
                }
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
                    this.setState({ assignments: json.steps});
                }
            }).catch((error) =>  {
            console.log('error', error);
        })

    }
    render() {
        const {user, changePassword, assignments } = this.state;
        console.log('assignments', assignments);
        return (
            <div className="user-section">
                <p>{user.firstname} {user.lastname}</p>
                <p>{user.email}</p>
                <p>Registrerad: {user.regdate}</p>
                <p>Senast inloggad: {user.lastlogin}</p>
                <p>Roll: {user.role}</p>
                <button onClick={() => {this.setState({changePassword: !changePassword})}}>Ändra lösenord</button>
                { changePassword &&
                <UpdatePassword userEmail={user.email} />
                }
                <h3>Inlämnade uppgifter</h3>
                {assignments &&
                assignments.map((assignment) => (
                    <p key={assignment  }>{assignment}</p>
                    ))
                }
            </div>
        )
    }
}

