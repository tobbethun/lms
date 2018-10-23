import React from'react';
import {Toast} from "./Toast";

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            userList: [],
            filtered: []
        };

    }

    handleChange(e) {
        let updatedList = this.state.userList;
        updatedList.map((item) => delete(item.id));
        const filtered = updatedList.filter(function(item){
            return Object.keys(item).some(key => item[key].toString().search(e.target.value.toLowerCase()) !== -1);
        });
        this.setState({userList: updatedList, filtered: filtered});
    }

    componentWillMount() {
        this.getUsers();
    }

    getUsers() {
        function handleErrors(response){
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch("/api/users/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                users: "",
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    const users = json.users;
                    users.map((user) => {
                        const courses = [];
                        json.usercourses.map((course, i) => {
                            if(user.email === course.email) {
                                courses.push(course.course_id)
                            }
                            return null
                        });
                        user.courses = courses.join(' ').toLowerCase();
                        return null
                    });
                    this.setState({userList: users, filtered: json.users, userCourses: json.usercourses});
                } else {
                    this.setState({registerMessage: json.success});
                }
            })
    }

    handleSubmit(e) {
        e.preventDefault();
        const pin = prompt('Verifiera med Pin kod');
        fetch("/api/admin/updatePassword/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                email: e.target.password.getAttribute('data'),
                newpassword: e.target.password.value,
                pin: pin,
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.password.setAttribute("readonly", "readonly");
                    this.setState({ message: json.success });
                    setTimeout(() => this.setState({ message: null }), 3500);
                }
                if (json.code === 204) {
                    this.setState({ message: json.success });
                    setTimeout(() => this.setState({ message: null }), 3500);
                }
            })
            .catch((e) =>  {
                console.log('error', e);
                this.setState({noNetworkMessage: 'Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan.'})
            })
    }
    render() {
        const { filtered, message } = this.state;
        return (
            <div className="admin-users">
                {message && <Toast message={message} />}
                <input onChange={this.handleChange} placeholder="Filtrera" />
                Antal resultat: {filtered.length}
                    {filtered.map((user, index) => (
                    <div key={index} className="admin-user">
                        <div>{user.first_name} {user.last_name}</div>
                        <div>{user.email}</div>
                        <div>{user.role}</div>
                        <div>
                            Kurser: {user.courses}
                        </div>
                        <form className="admin-update-password" onSubmit={this.handleSubmit}>
                            <input type="text" name="password" data={user.email} placeholder="Nytt lösenord" required ref={password => { this.password = password; }} />
                            <button className="admin-update-button">Uppdatera lösenord</button>
                        </form>
                    </div>
                    ))
                }

            </div>
        )
    }
}


export default Admin;
