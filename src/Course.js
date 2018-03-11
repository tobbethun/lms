import React from'react';
import Markup from './Markup';


export class Course extends React.Component {
    render() {
        const {course, lessons} = this.props;
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
                    <h3>Lektioner</h3>
                    {
                        lessons.map((lesson, index) => (
                            <div key={index}>
                                <h3>{lesson.fields.title}</h3>
                                <Markup text={lesson.fields.text} />
                                <hr/>
                            </div>
                        ))
                    }
                </div>
                }
            </div>
        )
    };
}

export default Course;