import React from "react";
import { Link, NavLink } from "react-router-dom";
import slugify from "slugify";

const CourseMenu = ({course, lessons, toggleMenu, hideMenu}) => {
    return (
        <div className={"side-bar " + (hideMenu && "side-bar__hidden")}>
            <div className="course-menu__header">
                <Link
                    to={`/kurs/${slugify(course.title)}`}
                    onClick={this.toggleMenu}
                >
                    {course.title}
                </Link>
                <div
                    onClick={toggleMenu}
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
    );
}

export default CourseMenu;


