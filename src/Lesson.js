import React from'react';
import Markup from './Markup';
import Comments from './Comments';
import {Link} from 'react-router-dom';
import slugify from 'slugify';


export class Lesson extends React.Component {
    render() {
        const {lesson, courseTitle, courseLength, index, nextLesson} = this.props;

        console.log('lesson', courseLength + ' || ' + index);
        return (
            <div>
                {lesson &&
                <div>
                    <h3>{lesson.fields.title}</h3>
                    <Markup text={lesson.fields.text} />
                    {lesson.fields.comments && <Comments lesson={lesson.sys.id}/> }
                    <hr/>
                    {!(courseLength === index) &&
                        <Link to={`/dashboard/${slugify(courseTitle)}/${slugify(nextLesson)}`}>NÄSTA STEG</Link>
                    }
                </div>
                }
            </div>
        )
    };
}

export default Lesson;
