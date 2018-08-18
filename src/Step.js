import React from'react';
import Markup from './Markup';
import Comments from './Comments';
import {Link} from 'react-router-dom';
import slugify from 'slugify';
import Attachment from "./Attachment";


export class Step extends React.Component {
    render() {
        const {step, lessonTitle, lessonLength, index, nextStep, preStep} = this.props;
        return (
            <div>
                {step &&
                <div>
                    <h3>{step.fields.title}</h3>
                    <Markup text={step.fields.text} />
                    {step.fields.comments && <Comments step={step.sys.id}/> }
                    {step.fields.fileUpload && <Attachment step={step.sys.id} /> }
                    <hr/>
                    {(index <= lessonLength && index > 1) &&
                    <Link to={`/dashboard/${slugify(lessonTitle)}/${slugify(preStep)}`}>FÖREGÅENDE STEG</Link>
                    }
                    {!(lessonLength === index) ?
                        <Link to={`/dashboard/${slugify(lessonTitle)}/${slugify(nextStep)}`}>NÄSTA STEG</Link> :
                        <p>Detta var det sista steget i lektionen. I menyn till vänster kan du gå vidare till nästa lektion.</p>
                    }
                </div>
                }
            </div>
        )
    };
}

export default Step;

