import React from 'react';
import fileDownload from 'js-file-download';
import file from "./img/file-alt.svg";

export class Download extends React.Component {
    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
    }

    download() {
        function handleErrors(response){
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch("/api/download/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: this.props.path,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.blob();
            }).then((blob) => {
            fileDownload(blob, this.props.fileName);
        });
    }
    render() {
        return (
            <div className="download">
                <img src={file} alt="fil-ikon" className="download-icon" />
                <span className="download-file" onClick={this.download} style={{color: this.props.colorCode}}>Ladda ner fil</span>
            </div>
        )
    }
}

export default Download;
