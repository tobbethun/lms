import React from 'react';
import slugify from 'slugify';
import Lesson from './Lesson';
import {getUser, handleErrors} from "./utils";
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Link,
    Switch,
} from 'react-router-dom';
import Loader from "./Loader";
import hamburger from "./img/Hamburger_icon.svg";
import icon from "./img/gearGreen.svg";
import {CourseStart} from "./CourseStart";


export class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            lessons: [],
            course: [],
            changePassword: false,
            hideMenu: false,
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

            }).then((json) => {
            this.getCourses(json.userCourses);
            this.setState({
                userCourses: json.userCourses
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

            }).then((json) => {
            this.setState({
                lessons: json.lessons,
                course: json.course
            });
        }).catch((error) => {
            console.log('error', error);
            this.setState({errorMessage: "Problem to fetch courses"})
        });
    }
    render() {
        const { lessons, course, errorMessage, hideMenu } = this.state;
        if (!this.state.lessons.length) return (
            <div>
                { errorMessage ?
                    (<h3>Du har har inga aktiva kurser för tillfället. Om detta inte stämmer kontakta din kursledare.</h3>) :
                    (<Loader />)
                }
            </div>
        );
        const courseStyle = {color: course.colorcode};
        const firstStep = 'dashboard/' + slugify(lessons[0].title) + '/' + slugify(lessons[0].steps[0].fields.title);
        return (
            <Router>
                <div>
                    <div className="container">
                        <div className={"side-bar " + (hideMenu && 'side-bar__hidden')} style={{borderColor: course.colorcode}}>
                            <div className="course-menu">
                                <ul style={courseStyle}>
                                    {lessons &&
                                    lessons.map((lesson, index) => (
                                        <li key={index} className={"course-menu--lesson " + (lesson.inactive ? 'inactive' : '')}>
                                            <span>{lesson.title}</span>
                                            {lesson.steps &&
                                            <ul className="course-list">
                                                {lesson.steps.map((step, index) => (
                                                    <li key={index}>
                                                        <img src={icon} alt="ikon" />
                                                        <NavLink exact to={`/dashboard/${slugify(lesson.title)}/${slugify(step.fields.title)}`} activeClassName='is-active'>{step.fields.title}</NavLink>
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
                        <div className={"content " + (hideMenu && 'content--slide-left')}>
                            <div className="course-info" style={{borderColor: course.colorcode && course.colorcode}}>
                                <img src={hamburger} onClick={() => this.setState({hideMenu: !this.state.hideMenu})} alt="hamburger-menu" className="hamburger" />
                                {course.organizationImage &&
                                    <Link to="/dashboard" className="logo-link">
                                        <img className="course-logo" src={course.organizationImage.fields.file.url} alt="logo" />
                                    </Link>
                                }
                                <div className="spacer" />
                            </div>
                            <Switch>
                                <Route exact path="/dashboard" render={()=><CourseStart title={course.title} text={course.courseInformation} firstStep={firstStep} />} />
                            {lessons &&
                            lessons.map((lesson, index) => (
                                <Route key={index} path={`/dashboard/${slugify(lesson.title)}`}
                                       component={() => <Lesson lesson={lesson} steps={lesson.steps}/>}/>
                            ))
                            }
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}
