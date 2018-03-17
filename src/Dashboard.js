import React from 'react';
import slugify from 'slugify';
import Course from './Course';
import {getUser} from "./utils";
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';


export class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            courses: [],
            user: getUser()
        };
    }
    componentWillMount() {
        fetch('http://localhost:5000/course/', {
            method: 'GET',
        }).then((response) => {
            // Convert to JSON
            return response.json();
        }).then((response) => {
            // Yay, `j` is a JavaScript object
            this.setState({courses: response});
        });
    }

    render() {
        if(!this.state.courses.length) return null;
        return (
            <div>
                <div className="user-section">
                    <h3>User:</h3>
                    <p>{this.state.user.firstname} {this.state.user.lastname}</p>
                    <p>{this.state.user.email}</p>
                    <p>Registered: {this.state.user.regdate}</p>
                    <p>Last loggedin: {this.state.user.lastlogin}</p>
                </div>
                <Router>
                    <div>
                        <div className="course-menu">
                            <ul>
                            {/*<Route path="/public" component={Public}/>*/}
                            { this.state.courses &&
                            this.state.courses.map((course, index) => (
                                    <li key={index}>
                                        <Link to={`/dashboard/${slugify(course.title)}`}>{course.title}</Link>
                                    </li>
                            ))
                            }
                            </ul>
                        </div>
                        { this.state.courses &&
                        this.state.courses.map((course, index) => (
                            <Route key={index} path={`/dashboard/${slugify(course.title)}`} component={()=><Course course={course} lessons={course.lessons}/>}/>
                        ))
                        }
                    </div>
                </Router>
            </div>
        )
    }
}
