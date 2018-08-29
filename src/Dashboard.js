import React from 'react';
import slugify from 'slugify';
import Course from './Lesson';
import {getUser, handleErrors} from "./utils";
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
            lessons: [],
            course: [],
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
        fetch('/api/usercourses/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.user.email,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();

            }).then((response) => {
            this.getCourses(response.userCourses);
            this.setState({
                userCourses: response.userCourses
            });
        }).catch(() => this.setState({errorMessage: "Problem to fetch Usercourses"}));
    }

    getCourses(usercourses) {
        fetch('/api/course/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userCourses: usercourses,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();

            }).then((response) => {
            this.setState({
                lessons: response.lessons,
                course: response.course
            });
        }).catch(() => this.setState({errorMessage: "Problem to fetch courses"}));
    }
    render() {
        const { lessons, course, errorMessage } = this.state;
        if (!this.state.lessons.length) return (
            <div>
                { errorMessage ?
                    (<h3>Du har har inga aktiva kurser för tillfället. Om detta inte stämmer kontakta din kursledare.</h3>) :
                    (<Loader />)
                }
            </div>
        );
        return (
            <Router>
                <div>
                    <div className="course-info">
                        <h3>{course.title}</h3>
                        <p>{course.courseInformation}</p>
                    </div>
                    <div className="container">
                        <div className="side-bar">
                            <div className="course-menu">
                                <ul>
                                    {lessons &&
                                    lessons.map((lesson, index) => (
                                        <li key={index}>
                                            <p>{lesson.title}</p>
                                            {lesson.steps &&
                                            <ul>
                                                {lesson.steps.map((step, index) => (
                                                    <li key={index}>
                                                        <Link to={`/dashboard/${slugify(lesson.title)}/${slugify(step.fields.title)}`}>{step.fields.title}</Link>
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
                            {lessons &&
                            lessons.map((lesson, index) => (
                                <Route key={index} path={`/dashboard/${slugify(lesson.title)}`}
                                       component={() => <Course lesson={lesson} steps={lesson.steps}/>}/>
                            ))
                            }
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}
