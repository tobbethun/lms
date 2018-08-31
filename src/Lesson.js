import React from'react';
import slugify from 'slugify';
import Step from "./Step";
import {Route} from 'react-router-dom';


export class Lesson extends React.Component {
    render() {
        const {lesson, steps} = this.props;
        const lessonLength = steps && steps.length;
        const titleList = [];
        steps && steps.map((step) => titleList.push(step.fields.title));
        return (
            <div className="lesson-container">
                {lesson &&
                <div>
                    <h2>{lesson.title}</h2>
                </div>
                }
                {steps &&
                <div>
                    {steps.map((step, index) => (
                        <Route key={index} path={`/dashboard/${slugify(lesson.title)}/${slugify(step.fields.title)}`}
                               component={() => <Step step={step} lessonLength={lessonLength} index={index+1} lessonTitle={lesson.title} nextStep={titleList[index+1]} preStep={titleList[index-1]}  />}/>
                    ))
                    }
                </div>
                }
            </div>
        )
    };
}

export default Lesson;
