import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import slugify from "slugify";
import { AuthButtonWithRouter } from "./Dashboard";
import { UserSection } from "./UserSection";
import { CourseStart } from "./CourseStart";
import Lesson from "./Lesson";

const CourseContent = ({course, lessons, hideMenu, onlyOneCourse}) => {
    const firstStep =
        lessons &&
        slugify(course.title) +
        "/" +
        slugify(lessons[0].title) +
        "/" +
        slugify(lessons[0].steps[0].fields.title);
    return (
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
                    onClick={this.toggleMenu}
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
    )
};

export default CourseContent;
