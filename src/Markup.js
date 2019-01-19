import React from "react";
import marked from "marked";

export class Markup extends React.Component {
    getMarkdownText(text) {
        const rawMarkup = marked(text, { sanitize: false });
        return { __html: rawMarkup };
    }
    render() {
        const { text } = this.props;
        return <div dangerouslySetInnerHTML={this.getMarkdownText(text)} />;
    }
}

export default Markup;
