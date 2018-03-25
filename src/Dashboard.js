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
        const { courses, errorMessage, user} = this.state;
        if (!this.state.courses.length) return (
            <div>
                { errorMessage ?
                    (<h3>Problem att hämta kursinnehåll</h3>) :
                    (<h3>Det finns tyvärr inga kurser för tillfället</h3>)
                }
            </div>
        );
        return (
            <div>
                <div className="user-section">
                    <h3>User:</h3>
                    <p>{user.firstname} {user.lastname}</p>
                    <p>{user.email}</p>
                    <p>Registered: {user.regdate}</p>
                    <p>Last loggedin: {user.lastlogin}</p>
                    <UpdatePassword userEmail={user.email} />
                </div>
                <Router>
                    <div>
                        <div className="course-menu">
                            <ul>
                                {/*<Route path="/public" component={Public}/>*/}
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
