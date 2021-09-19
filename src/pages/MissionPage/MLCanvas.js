import React, {Component} from "react";

class MLCanvas extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.picture = this.props.picture;

    }

    componentDidMount() {

        let p = this.picture;

        if (this.canvas && this.canvas.current) {

            let ctx = this.canvas.current.getContext("2d");
            let img = document.createElement("img");
            img.src = p.source;
            img.onload = function (e) {
                ctx.drawImage(img, 10, 10);
                ctx.font = "30px Sans-serif";
                ctx.fillStyle = "red";
                ctx.lineWidth = 8;
                if (p.bounding_boxes) {
                    ctx.beginPath();
                    p.bounding_boxes.forEach(bb => {
                        ctx.rect(bb.xmin * 1280, bb.ymin * 720,
                            (bb.xmax - bb.xmin) * 1280,
                            (bb.ymax - bb.ymin) * 720);
                        ctx.fillStyle = "red";
                        ctx.fillRect(bb.xmin * 1280 - 5, bb.ymin * 720 - 40, 258, 40);
                        ctx.strokeStyle = 'red';
                        ctx.stroke();
                        ctx.strokeStyle = 'black';
                        ctx.strokeText("Sea Turtle " + (bb.score * 100).toFixed(2) + "%",
                            bb.xmin * 1280, bb.ymin * 720 - 8);
                        ctx.fillStyle = 'white';
                        ctx.fillText("Sea Turtle " + (bb.score * 100).toFixed(2) + "%",
                            bb.xmin * 1280, bb.ymin * 720 - 8);
                    })
                } else {
                    ctx.fillStyle = "red";
                    ctx.fillRect(50, 20, 350, 55);
                    ctx.strokeStyle = 'red';
                    ctx.stroke();
                    ctx.strokeStyle = 'black';
                    ctx.strokeText("Sea Turtle Not Detected.", 60, 60);
                    ctx.fillStyle = 'white';
                    ctx.fillText("Sea Turtle Not Detected.", 60, 60);
                }
            }

        }
    }


    render() {
        return (<canvas ref={this.canvas}
                        style={{
                            paddingLeft: "0",
                            paddingRight: "0",
                            marginLeft: "0",
                            marginRight: "0",
                            display: "block",
                            width: "1000px"
                        }}
                        width="1280" height="720"/>);
    }
}


export default MLCanvas;
