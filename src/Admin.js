import React from'react';

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
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            role: this.state.role,
            comment: this.state.comment,
            course: this.props.courseID,
            step: this.state.step,
        };
        fetch("/api/comment/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role,
                course: data.course,
                comment: data.comment,
                step: data.step
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({registerMessage: json.success, commentstatus: 'success', comment: ''});
                    this.btn.removeAttribute("disabled");
                }
                if (json.code === 400) this.setState({errorMessage: "Något gick fel, försök igen"}); this.btn.removeAttribute("disabled");
            })
            .then(this.getComments())
    }
    render() {
        const { filtered } = this.state;
        return (
            <div className="admin-users">
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
                        <form className="admin-update-password">
                            <input type="text" placeholder="Nytt lösenord"/>
                            <input type="password" placeholder="Pinkod" />
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
