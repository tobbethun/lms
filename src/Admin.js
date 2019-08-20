import React from "react";
import { Toast } from "./Toast";
import Delete from "./Delete";
import { handleErrors } from "./utils";
import UpdateUserInfo from "./UpdateUserInfo";

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            filtered: []
        };
    }

    handleChange = (e) => {
        let updatedList = this.state.userList;
        updatedList.map(item => delete item.id);
        const filtered = updatedList.filter(function(item) {
            return Object.keys(item).some(
                key =>
                    item[key]
                        .toString()
                        .search(e.target.value.toLowerCase()) !== -1
            );
        });
        this.setState({ userList: updatedList, filtered: filtered });
    };

    componentWillMount() {
        this.getUsers();
    }

    getUsers = () => {
        fetch("/api/users/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                users: ""
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    const users = json.users;
                    users.map(user => {
                        const courses = [];
                        json.usercourses.map((course, i) => {
                            if (user.email === course.email) {
                                courses.push(course.course_id);
                            }
                            return null;
                        });
                        user.courses = courses.join(" ").toLowerCase();
                        return null;
                    });
                    this.setState({
                        userList: users,
                        filtered: json.users,
                        userCourses: json.usercourses
                    });
                } else {
                    this.setState({ registerMessage: json.success });
                }
            });
    };

    render() {
        const { filtered, message } = this.state;
        const adminDelete = this.props.role;
        return (
            <div className="admin-users">
                {message && <Toast message={message} />}
                <input onChange={this.handleChange} placeholder="Filtrera" />
                Antal resultat: {filtered.length}
                {filtered.map((user, index) => (
                    <div key={index} className="admin-user">
                        <div>
                            {user.first_name} {user.last_name}
                        </div>
                        <div>{user.email}</div>
                        <div>{user.role}</div>
                        <div>Kurser: {user.courses}</div>
                        <UpdateUserInfo
                            user={user}
                        />
                        {adminDelete && <Delete id={user.id} table="users" />}
                    </div>
                ))}
            </div>
        );
    }
}

export default Admin;
