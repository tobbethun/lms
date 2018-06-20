import React from 'react';
import slugify from 'slugify';
import Course from './Course';
import {getUser} from "./utils";
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import Loader from "./Loader";


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
        const { courses, errorMessage } = this.state;
        if (!this.state.courses.length) return (
            <div>
                { errorMessage ?
                    (<h3>Problem att hämta kursinnehåll</h3>) :
                    (<Loader />)
                }
            </div>
        );
        return (
            <Router>
                <div className="dashboard">
                    <div className="side-bar">
                        <div className="course-menu">
                            <ul>
                                {courses &&
                                courses.map((course, index) => (
                                    <li key={index}>
                                        <Link to={`/dashboard/${slugify(course.title)}`}>{course.title}</Link>
                                        {course.lessons &&
                                            <ul>
                                                {course.lessons.map((lesson, index) => (
                                                <li key={index}>
                                                    <Link to={`/dashboard/${slugify(course.title)}/#${slugify(lesson.fields.title)}`}>{lesson.fields.title}</Link>
                                                </li>
                                            ))}
                                            </ul>
                                        }
                                    </li>
                                ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="content">
                        {courses &&
                        courses.map((course, index) => (
                            <Route key={index} path={`/dashboard/${slugify(course.title)}`}
                                   component={() => <Course course={course} lessons={course.lessons}/>}/>
                        ))
                        }
                    </div>
                </div>
            </Router>
        )
    }
}
