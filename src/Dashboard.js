import React from 'react';
import slugify from 'slugify';
import Lesson from './Lesson';
import {getUser, handleErrors} from "./utils";
import {
    Route,
    NavLink,
    Link,
    Switch, withRouter,
} from 'react-router-dom';
import Loader from "./Loader";
import {CourseStart} from "./CourseStart";
import {UserSection} from "./UserSection";
import {Auth} from "./App";

export const AuthButton = withRouter(({history}) => (
    Auth.isAuthenticated || localStorage.loggedIn
        ?
        <div className="user-logout">
            <Link to="/kurs/user" className="user">Min sida</Link>
            <Link to="/login" className="logout" onClick={() => {Auth.signout(() => history.push('/'))}}>Logga ut</Link>
        </div>
        :
        <div />
));


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
                this.getCourses(json.userCourses[0]); // only takes the first course. Later when we have support for multiple courses this value should be set by user.
                this.setState({
                    userCourses: json.userCourses
            });
        })
            .catch(() => this.setState({errorMessage: true}));
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
                if (json.code === 200) {
                    this.setState({
                        lessons: json.lessons,
                        course: json.course[0]
                    });
                }
                if (json.code === 204) {
                    this.setState({
                        errorMessage: true,
                        message: json.message
                    });
                }

        }).catch((error) => {
            console.log('error', error);
            this.setState({errorMessage: true, message: "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."})
        });
    }
    toggleMenu = () => {
        if(window.innerWidth < 768) this.setState({hideMenu: !this.state.hideMenu});
    };

    render() {
        const { lessons, course, errorMessage, message, hideMenu } = this.state;
        if (!this.state.lessons.length) return (
            <div>
                { errorMessage ?
                    (
                        <div className="no-courses">
                            <div className="top-bar">
                                <Link to="/login" className="logo">ELD Studio</Link>
                                <AuthButton />
                            </div>
                            <div className="lesson-container">
                                <h3>{message}</h3>
                            </div>
                        </div>
                        ) :
                    (<Loader />)
                }
            </div>
        );
        const firstStep = 'kurs/' + slugify(lessons[0].title) + '/' + slugify(lessons[0].steps[0].fields.title);
        return (
                <div>
                    <div className="container">
                        <div className={"side-bar " + (hideMenu && 'side-bar__hidden')}>
                            <div className="course-menu__header">
                                <Link to="/kurs" onClick={this.toggleMenu}>{course.title}</Link>
                                <div onClick={() => this.setState({hideMenu: !this.state.hideMenu})} className="hamburger hamburger--in-menu">
                                    <div style={{backgroundColor: course.colorcode}} />
                                    <div style={{backgroundColor: course.colorcode}} />
                                    <div style={{backgroundColor: course.colorcode}} />
                                </div>
                            </div>
                            <div className="course-menu">

                                <div>
                                    <ul style={{color: course.colorcode}}>
                                        {lessons &&
                                        lessons.map((lesson, index) => (
                                            <li key={index} className={"course-menu--lesson " + (lesson.inactive ? 'inactive' : '')}>
                                                <span className="lesson-title">{lesson.title}</span>
                                                {lesson.steps &&
                                                <ul className="course-list">
                                                    {lesson.steps.map((step, index) => (
                                                        <li key={index}>
                                                            <NavLink exact to={`/kurs/${slugify(lesson.title)}/${slugify(step.fields.title)}`} activeClassName='is-active' onClick={this.toggleMenu}>{step.fields.title}</NavLink>
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
                        </div>
                        <div className={"content " + (hideMenu && 'content--slide-left')}>
                            <div className="course-info" style={{color: course.colorcode}}>
                                <div onClick={() => this.setState({hideMenu: !this.state.hideMenu})} className="hamburger">
                                    <div style={{backgroundColor: course.colorcode}} />
                                    <div style={{backgroundColor: course.colorcode}} />
                                    <div style={{backgroundColor: course.colorcode}} />
                                </div>
                                {course.organizationImage &&
                                    <Link to="/kurs" className="logo-link">
                                        <img className="course-logo" src={course.organizationImage.fields.file.url} alt="logo" />
                                    </Link>
                                }
                                <AuthButton />
                            </div>
                            <Switch>
                                <Route exact path='/kurs/user' render={()=><UserSection lessons={lessons} />} />
                                <Route exact path="/kurs" render={()=><CourseStart title={course.title} text={course.courseInformation} firstStep={firstStep} colorCode={course.colorcode} />} />
                            {lessons &&
                            lessons.map((lesson, index) => (
                                <Route key={index} path={`/kurs/${slugify(lesson.title)}`}
                                       component={() => <Lesson courseID={course.id} lesson={lesson} steps={lesson.steps} colorCode={course.colorcode}/>}/>
                            ))
                            }
                            </Switch>
                        </div>
                    </div>
                </div>
        )
    }
}
