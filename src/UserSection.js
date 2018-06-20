import React from 'react';
import {getUser} from "./utils";
import UpdatePassword from "./UpdatePassword";


export class UserSection extends React.Component {
    constructor() {
        super();
        this.state = {
            changePassword: false,
            user: getUser()
        };
    }
    render() {
        const {user, changePassword } = this.state;
        return (
            <div className="user-section">
                <p>{user.firstname} {user.lastname}</p>
                <p>{user.email}</p>
                <p>Registered: {user.regdate}</p>
                <p>Last loggedin: {user.lastlogin}</p>
                <button onClick={() => {this.setState({changePassword: !changePassword})}}>Change password</button>
                { changePassword &&
                <UpdatePassword userEmail={user.email} />
                }
            </div>
        )
    }
}
/**
 * Created by tobiasthun on 2018-06-17.
 */
