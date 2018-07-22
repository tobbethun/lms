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
        fetch('http://localhost:5000/usercourses/', {
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
        fetch('http://localhost:5000/course/', {
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
                lessons: response.lessons
            });
        }).catch(() => this.setState({errorMessage: "Problem to fetch courses"}));
    }
    render() {
        const { lessons, errorMessage } = this.state;
        if (!this.state.lessons.length) return (
            <div>
                { errorMessage ?
                    (<h3>Du har har inga aktiva kurser för tillfället. Om detta inte stämmer kontakta din kursledare.</h3>) :
                    (<Loader />)
                }
            </div>
        );
        console.log('lessons', lessons);
        return (
            <Router>
                <div className="dashboard">
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
            </Router>
        )
    }
}
