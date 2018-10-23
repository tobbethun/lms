import React from 'react';
import {getUser, handleErrors} from "./utils";
import UpdatePassword from "./UpdatePassword";
import check from "./img/check.svg";
import Admin from "./Admin";


export class UserSection extends React.Component {
    constructor() {
        super();
        this.state = {
            changePassword: false,
            user: getUser(),
            adminPass: "",
            assignments: []
        };
    }

    componentWillMount() {
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
                    userEmail: this.state.user.email
                })
            })
            .then(handleErrors)
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                if(json.code === 200) {
                    this.setState({ uploads: json.uploads});
                }
            })
            .catch(() =>  {
                this.setState({noNetworkMessage: 'Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan.'});
            })
    }

    render() {
        const assignments = [];
        this.props.lessons.map((lesson) => (
           lesson.steps.map((step) => (
               step.fields.fileUpload &&
                   assignments.push({fields: step.fields, id: step.sys.id})
           ))

        ));
        const {user, changePassword, uploads, noNetworkMessage} = this.state;
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
                    {assignments.length > 0 &&
                        <div>
                            <h3>Inlämnade uppgifter</h3>
                            {assignments.map((assignment) => (
                            <div key={assignment.fields.title} className="assignments-row">
                                <div>{assignment.fields.title}</div>
                                {uploads && uploads.indexOf(assignment.id) > -1 ?
                                    <div className="check">
                                        <img src={check} alt="check-mark"/>
                                    </div> :
                                    <div className="cross"/>
                                }
                            </div>
                            ))}
                        </div>
                    }
                </div>
                {user.role === "admin" &&
                <div>
                    <Admin role={user.role} />
                </div>
                }
            </div>
        )
    }
}

