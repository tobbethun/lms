import React from "react";
import slugify from "slugify";
import Step from "./Step";
import { Route } from "react-router-dom";

export class Lesson extends React.Component {
    render() {
        const { courseID, courseTitle, lesson, steps, colorCode } = this.props;
        const lessonLength = steps && steps.length;
        const titleList = [];
        steps && steps.map(step => titleList.push(step.fields.title));
        return (
            <div className="lesson-container">
                {lesson && <span className="breadcrumb">{lesson.title}</span>}
                {steps && (
                    <div>
                        {steps.map((step, index) => (
                            <Route
                                key={index}
                                path={`/kurs/${slugify(courseTitle)}/${slugify(
                                    lesson.title
                                )}/${slugify(step.fields.title)}`}
                                component={() => (
                                    <Step
                                        courseID={courseID}
                                        courseTitle={courseTitle}
                                        step={step}
                                        lessonLength={lessonLength}
                                        index={index + 1}
                                        lessonTitle={lesson.title}
                                        nextStep={titleList[index + 1]}
                                        preStep={titleList[index - 1]}
                                        colorCode={colorCode}
                                    />
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default Lesson;
