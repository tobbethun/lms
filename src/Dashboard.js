import React from 'react';
import slugify from 'slugify';
import {getUser, handleErrors} from "./utils";
import {
    Route,
    Link,
    Switch, withRouter,
} from 'react-router-dom';
import Loader from "./Loader";
import {Auth} from "./App";
import {Course} from "./Course";

export const AuthButton = withRouter(({history}) => (
    Auth.isAuthenticated || localStorage.loggedIn
        ?
        <div className="user-logout">
            <Link to="/kurs/user" className="user">Min sida </Link>
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
                this.setState({userCourses: json.userCourses});
            json.userCourses.map((item) => (
                this.getCourses(item)
         ))
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

        }).catch((error) => {
            console.log('error', error);
            this.setState({errorMessage: true, message: "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."})
        });
    }
    toggleMenu = () => {
        if(window.innerWidth < 768) this.setState({hideMenu: !this.state.hideMenu});
    };

    render() {
        const { lessons, course, errorMessage, message } = this.state;
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
        return (
                <div>
                    <ul>
                    {course.map((course, index) =>
                        <li key={index}>
                            <Link to={`/kurs/${slugify(course.title)}`}>{course.title}</Link>
                        </li>
                    )}
                    </ul>
                    <Switch>
                        {course &&
                        course.map((course, index) => (
                            <Route key={index} path={`/kurs/${slugify(course.title)}`}
                                   component={() => <Course course={course} lessons={lessons[index]}/>}/>
                        ))
                        }
                    </Switch>
                </div>
        )
    }
}
