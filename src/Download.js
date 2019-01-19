import React from "react";
import fileDownload from "js-file-download";
import file from "./img/file-alt.svg";
import { handleErrors } from "./utils";

export class Download extends React.Component {
    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
        this.openInTab = this.openInTab.bind(this);
    }

    download() {
        fetch("/api/download/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                path: this.props.path
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                fileDownload(blob, this.props.fileName);
            });
    }
    openInTab() {
        const windowReference = window.open();
        fetch("/api/download/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                path: this.props.path
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                const file = new Blob([blob], { type: "application/pdf" });
                windowReference.location = URL.createObjectURL(file);
            });
    }
    render() {
        return (
            <div className="download">
                <img src={file} alt="fil-ikon" className="download-icon" />
                {this.props.fileName.match("pdf$") ? (
                    <div className="download-and-open">
                        <span
                            className="download-file"
                            onClick={this.download}
                            style={{ color: this.props.colorCode }}
                        >
                            Ladda ner fil
                        </span>
                        <span
                            className="download-file open-in-tab"
                            onClick={this.openInTab}
                            style={{ color: this.props.colorCode }}
                        >
                            Öppna PDF i ny flik
                        </span>
                    </div>
                ) : (
                    <span
                        className="download-file"
                        onClick={this.download}
                        style={{ color: this.props.colorCode }}
                    >
                        Ladda ner fil
                    </span>
                )}
            </div>
        );
    }
}

export default Download;
