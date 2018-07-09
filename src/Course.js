import React from'react';
import Markup from './Markup';
import slugify from 'slugify';
import Lesson from "./Lesson";
import {Route} from 'react-router-dom';


export class Course extends React.Component {
    render() {
        const {course, lessons} = this.props;
        const courseLength = lessons && lessons.length;
        const titleList = [];
        lessons && lessons.map((lesson) => titleList.push(lesson.fields.title));
        console.log('courseLength', courseLength);
        return (
            <div>
                {course &&
                <div>
                    <h2>{course.title}</h2>
                    <Markup text={course.text} />
                </div>
                }
                {lessons &&
                <div>
                    {lessons.map((lesson, index) => (
                        <Route key={index} path={`/dashboard/${slugify(course.title)}/${slugify(lesson.fields.title)}`}
                               component={() => <Lesson lesson={lesson} courseLength={courseLength} index={index+1} courseTitle={course.title} nextLesson={titleList[index+1]} />}/>
                    ))
                    }
                </div>
                }
            </div>
        )
    };
}

export default Course;
