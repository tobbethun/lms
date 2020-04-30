import React, { Component } from "react";
import slugify from "slugify";
import CourseMenu from "./CourseMenu";
import CourseContent from "./CourseContent";

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
        const toggleMenu = () => {
            this.setState({
                hideMenu: !this.state.hideMenu
            })
        };
        return (
            <div>
                <div className="container">
                    {lessons &&
                        <CourseMenu
                            course={course}
                            lessons={lessons}
                            toggleMenu={toggleMenu}
                            hideMenu={hideMenu}/>
                    }
                    {lessons &&
                        <CourseContent
                            course={course}
                            lessons={lessons}
                            toggleMenu={toggleMenu}
                            hideMenu={hideMenu}
                            onlyOneCourse={onlyOneCourse}
                        />
                    }
                </div>
            </div>
        );
    }
}
