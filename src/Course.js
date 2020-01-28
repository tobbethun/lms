import React, { Component } from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import slugify from "slugify";
import { UserSection } from "./UserSection";
import { CourseStart } from "./CourseStart";
import Lesson from "./Lesson";
import { AuthButtonWithRouter } from "./Dashboard";

export class Course extends Component {
    constructor() {
        super();
        this.state = {
            changePassword: false,
            hideMenu: false
        };
    }
    componentDidMount() {
        this.props.history &&
            this.props.location.pathname === "/kurs" &&
            this.props.history.push(
                `/kurs/${slugify(this.props.course.title)}`
            );
    }
    render() {
        const { course, lessons, onlyOneCourse } = this.props;
        const { hideMenu } = this.state;
        const firstStep =
            lessons &&
            slugify(course.title) +
                "/" +
                slugify(lessons[0].title) +
                "/" +
                slugify(lessons[0].steps[0].fields.title);
        return (
            <div>
                <div className="container">
                    <div className={"side-bar " + (hideMenu && "side-bar__hidden")}>
                        <div className="course-menu__header">
                            <Link
                                to={`/kurs/${slugify(course.title)}`}
                                onClick={this.toggleMenu}
                            >
                                {course.title}
                            </Link>
                            <div
                                onClick={() =>
                                    this.setState({
                                        hideMenu: !this.state.hideMenu
                                    })
                                }
                                className="hamburger hamburger--in-menu"
                            >
                                <div
                                    style={{
                                        backgroundColor: course.colorcode
                                    }}
                                />
                                <div
                                    style={{
                                        backgroundColor: course.colorcode
                                    }}
                                />
                                <div
                                    style={{
                                        backgroundColor: course.colorcode
                                    }}
                                />
                            </div>
                        </div>
                        <div className="course-menu">
                            <div>
                                <ul style={{ color: course.colorcode }}>
                                    {lessons &&
                                        lessons.map((lesson, index) => (
                                            <li
                                                key={index}
                                                className={
                                                    "course-menu--lesson " +
                                                    (lesson.inactive
                                                        ? "inactive"
                                                        : "")
                                                }
                                            >
                                                <span className="lesson-title">
                                                    {lesson.title}
                                                </span>
                                                {lesson.steps && (
                                                    <ul className="course-list">
                                                        {lesson.steps.map(
                                                            (step, index) => (
                                                                <li key={index}>
                                                                    <NavLink
                                                                        exact
                                                                        to={`/kurs/${slugify(
                                                                            course.title
                                                                        )}/${slugify(
                                                                            lesson.title
                                                                        )}/${slugify(
                                                                            step
                                                                                .fields
                                                                                .title
                                                                        )}`}
                                                                        activeClassName="is-active"
                                                                        onClick={this.toggleMenu}
                                                                    >
                                                                        {step.fields.title}
                                                                    </NavLink>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            "content " + (hideMenu && "content--slide-left")
                        }
                    >
                        <div
                            className="course-info"
                            style={{ color: course.colorcode }}
                        >
                            <div
                                onClick={() =>
                                    this.setState({
                                        hideMenu: !this.state.hideMenu
                                    })
                                }
                                className="hamburger"
                            >
                                <div
                                    style={{
                                        backgroundColor: course.colorcode
                                    }}
                                />
                                <div
                                    style={{
                                        backgroundColor: course.colorcode
                                    }}
                                />
                                <div
                                    style={{
                                        backgroundColor: course.colorcode
                                    }}
                                />
                            </div>
                            {course.organizationImage && (
                                <Link
                                    to={`/kurs/${slugify(course.title)}`}
                                    className="logo-link"
                                >
                                    <img
                                        className="course-logo"
                                        src={
                                            course.organizationImage.fields.file
                                                .url
                                        }
                                        alt="logo"
                                    />
                                </Link>
                            )}
                            <AuthButtonWithRouter
                                courseTitle={course.title}
                                courseColor={course.colorcode}
                                onlyOneCourse={onlyOneCourse}
                            />
                        </div>
                        <Switch>
                            <Route
                                path={`/kurs/${slugify(course.title)}/user`}
                                render={() => <UserSection lessons={lessons} />}
                            />
                            <Route
                                exact
                                path={`/kurs/${slugify(course.title)}`}
                                render={() => (
                                    <CourseStart
                                        title={course.title}
                                        text={course.courseInformation}
                                        firstStep={firstStep}
                                        colorCode={course.colorcode}
                                    />
                                )}
                            />
                            {lessons &&
                                lessons.map((lesson, index) => (
                                    <Route
                                        key={index}
                                        path={`/kurs/${slugify(
                                            course.title
                                        )}/${slugify(lesson.title)}`}
                                        component={() => (
                                            <Lesson
                                                courseID={course.id}
                                                courseTitle={course.title}
                                                lesson={lesson}
                                                steps={lesson.steps}
                                                colorCode={course.colorcode}
                                            />
                                        )}
                                    />
                                ))}
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}
