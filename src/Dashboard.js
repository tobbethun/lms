import React from "react";
import slugify from "slugify";
import { getUser, handleErrors } from "./utils";
import { Route, Link, Switch, withRouter } from "react-router-dom";
import Loader from "./Loader";
import { Auth, fireTracking } from "./App";
import { Course } from "./Course";
import Cog from "./Cog";

export class AuthButton extends React.Component {
    state = {showMenu: false};
    render() {
        const { history, courseTitle, courseColor, onlyOneCourse } = this.props;
        const { showMenu } = this.state;
        const isLoggedIn = Auth.isAuthenticated || localStorage.loggedIn;
        history && fireTracking(history.location.pathname);
        if (!isLoggedIn) return null;
        else {
            return (
                <div className="menu-right">
                    <div className="menu-right-icon" onClick={() => this.setState({showMenu: !showMenu})}>
                        <Cog color={courseColor} />
                    </div>
                    <div className={`menu-right-items ${showMenu ? "menu-right-visible" : ""}`}>
                        <Link
                            to={`/kurs/${slugify(courseTitle)}/user`}
                            className="user"
                        >
                            Min sida
                        </Link>
                        {!onlyOneCourse && (
                            <Link to="/kurs" className="user">
                                Mina kurser
                            </Link>
                        )}
                        <Link
                            to="/login"
                            className="logout"
                            onClick={() => {
                                Auth.signout(() => history.push("/"));
                            }}
                        >
                            Logga ut
                        </Link>
                    </div>
                </div>
            );
        }
    }
}
export const AuthButtonWithRouter = withRouter(AuthButton);

export class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            lessons: [],
            course: [],
            userCourses: [],
            changePassword: false,
            hideMenu: false,
            showBadges: true,
            user: getUser()
        };
    }

    componentDidMount() {
        if (this.state.userCourses) {
            fetch("/api/usercourses/", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.user.email
                })
            })
                .then(handleErrors)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.setState({ userCourses: json.userCourses });
                    json.userCourses.map(item => this.getCourses(item));
                })
                .catch(() => this.setState({ errorMessage: true }));
        }
    }

    getCourses(usercourses) {
        fetch("/api/course/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userCourses: usercourses
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState(previousState => ({
                        course: [...previousState.course, json.course[0]],
                        lessons: [...previousState.lessons, json.lessons]
                    }));
                }
                if (json.code === 204) {
                    this.setState({
                        errorMessage: true,
                        message: json.message
                    });
                }
            })
            .catch(error => {
                console.log("error", error);
                this.setState({
                    errorMessage: true,
                    message:
                        "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."
                });
            });
    }
    toggleMenu = () => {
        if (window.innerWidth < 768)
            this.setState({ hideMenu: !this.state.hideMenu });
    };

    render() {
        const {
            lessons,
            course,
            userCourses,
            errorMessage,
            message,
            showBadges
        } = this.state;
        if (!this.state.lessons.length)
            return (
                <div>
                    {errorMessage ? (
                        <div className="no-courses">
                            <div className="top-bar">
                                <Link to="/login" className="logo">
                                    ELD Studio
                                </Link>
                                <AuthButton />
                            </div>
                            <div className="lesson-container">
                                <h3>{message}</h3>
                            </div>
                        </div>
                    ) : (
                        <Loader />
                    )}
                </div>
            );
        if (userCourses.length > 1 && showBadges) {
            return (
                <div>
                    <div className="course-badges">
                        <h1>Välj kurs</h1>
                        {course.map((course, index) => (
                            <Link
                                to={`/kurs/${slugify(course.title)}`}
                                key={index}
                                className="course-badge"
                            >
                                <h4>{course.title}</h4>
                            </Link>
                        ))}
                    </div>
                    <Switch>
                        {course &&
                            course.map((course, index) => (
                                <Route
                                    key={index}
                                    path={`/kurs/${slugify(course.title)}`}
                                    component={() => (
                                        <Course
                                            course={course}
                                            lessons={lessons[index]}
                                        />
                                    )}
                                />
                            ))}
                    </Switch>
                </div>
            );
        } else {
            return (
                <div>
                    <Course
                        course={course[0]}
                        lessons={lessons[0]}
                        history={this.props.history}
                        location={this.props.location}
                        onlyOneCourse
                    />
                </div>
            );
        }
    }
}
