import React from "react";
import Markup from "./Markup";
import Comments from "./Comments";
import { Link } from "react-router-dom";
import slugify from "slugify";
import Attachment from "./Attachment";

export class Step extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        const {
            courseID,
            courseTitle,
            step,
            lessonTitle,
            lessonLength,
            index,
            nextStep,
            preStep,
            colorCode
        } = this.props;
        return (
            <div>
                {step && (
                    <div>
                        <h1>{step.fields.title}</h1>
                        {step.fields.text && <Markup text={step.fields.text} />}
                        {step.fields.comments && (
                            <Comments
                                courseID={courseID}
                                step={step.sys.id}
                                colorCode={colorCode}
                            />
                        )}
                        {step.fields.fileUpload && (
                            <Attachment
                                courseID={courseID}
                                step={step.sys.id}
                                colorCode={colorCode}
                            />
                        )}
                        <div className="stepper-container">
                            {index <= lessonLength && index > 1 ? (
                                <Link
                                    to={`/kurs/${slugify(
                                        courseTitle
                                    )}/${slugify(lessonTitle)}/${slugify(
                                        preStep
                                    )}`}
                                    className="stepper stepper__prev"
                                    style={{ backgroundColor: colorCode }}
                                >
                                    <div className="arrow-left" />
                                    <span>Tillbaka</span>
                                </Link>
                            ) : (
                                <div className="stepper__prev" />
                            )}
                            <div className="current-step">
                                {index}/{lessonLength}
                            </div>

                            {!(lessonLength === index) ? (
                                <Link
                                    to={`/kurs/${slugify(
                                        courseTitle
                                    )}/${slugify(lessonTitle)}/${slugify(
                                        nextStep
                                    )}`}
                                    className="stepper stepper__next"
                                    style={{ backgroundColor: colorCode }}
                                >
                                    <div className="arrow-right" />
                                    <span>Nästa</span>
                                </Link>
                            ) : (
                                <div className="stepper__next" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Step;
