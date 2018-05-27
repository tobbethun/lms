import React from 'react';
import slugify from 'slugify';
import Course from './Course';
import {getUser} from "./utils";
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import UpdatePassword from "./UpdatePassword";


export class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            courses: [],
            changePassword: false,
            user: getUser()
        };
    }

    componentWillMount() {
        function handleErrors(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch('http://localhost:5000/course/', {
            method: 'GET',
        }).then(handleErrors)
            .then((response) => {
                return response.json();

            }).then((response) => {
            this.setState({courses: response});
        }).catch(() => this.setState({errorMessage: "Problem to fetch courses"}));
    }
    render() {
        const { courses, errorMessage, user, changePassword } = this.state;
        if (!this.state.courses.length) return (
            <div>
                { errorMessage ?
                    (<h3>Problem att hämta kursinnehåll</h3>) :
                    (<h3>Det finns tyvärr inga kurser för tillfället</h3>)
                }
            </div>
        );
        return (
            <div className="dashboard">
                <div className="side-bar">
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
                </div>
                <Router>
                    <div className="content">
                        <div className="course-menu">
                            <ul>
                                {courses &&
                                courses.map((course, index) => (
                                    <li key={index}>
                                        <Link to={`/dashboard/${slugify(course.title)}`}>{course.title}</Link>
                                    </li>
                                ))
                                }
                            </ul>
                        </div>
                        {courses &&
                        courses.map((course, index) => (
                            <Route key={index} path={`/dashboard/${slugify(course.title)}`}
                                   component={() => <Course course={course} lessons={course.lessons}/>}/>
                        ))
                        }
                    </div>
                </Router>
            </div>
        )
    }
}
