import React from'react';
import Markup from './Markup';
import Comments from './Comments';
import {Link} from 'react-router-dom';
import slugify from 'slugify';
import Attachment from "./Attachment";


export class Step extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const {step, lessonTitle, lessonLength, index, nextStep, preStep, colorCode} = this.props;
        return (
            <div>
                {step &&
                <div>
                    <h3>{step.fields.title}</h3>
                    <Markup text={step.fields.text} />
                    {step.fields.comments && <Comments step={step.sys.id} colorCode={colorCode}/> }
                    {step.fields.fileUpload && <Attachment step={step.sys.id} colorCode={colorCode} /> }
                    <div className="stepper-container">
                        {(index <= lessonLength && index > 1) &&
                        <Link to={`/dashboard/${slugify(lessonTitle)}/${slugify(preStep)}`} className="stepper stepper__prev" style={{backgroundColor: colorCode}}><div className="arrow-left"/><span>FÖREGÅENDE SIDA</span></Link>
                        }
                        {!(lessonLength === index) ?
                            <Link to={`/dashboard/${slugify(lessonTitle)}/${slugify(nextStep)}`} className="stepper stepper__next" style={{backgroundColor: colorCode}}><div className="arrow-right"/><span>NÄSTA SIDA</span></Link> :
                            <p>Detta var det sista steget i lektionen. I menyn till vänster kan du gå vidare till nästa lektion.</p>
                        }
                    </div>
                </div>
                }
            </div>
        )
    };
}

export default Step;

