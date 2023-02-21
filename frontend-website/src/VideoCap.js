import React, { Component } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPlayer from "react-player";

class VideoCap extends Component {
  state = { prev_disp: false, playing: false, controls: true };

  update_answers = (event) => {
    this.props.update_results({
      answer: event.target.value,
      busyness: 3,
      question: this.props.source,
    });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const adapt_state = prevState;
    if (nextProps.display_survey) {
      adapt_state.controls = false;
      adapt_state.playing = false;
      adapt_state.prev_disp = true;
    } else if (!nextProps.display_survey && adapt_state.prev_disp) {
      adapt_state.controls = true;
      adapt_state.prev_disp = false;
    }
    return adapt_state;
  };

  setPlaying = () => {
    this.setState({ playing: true });
  };

  render() {
    return (
      <div>
        <Form>
          <Form.Group className="mb-3" controlId={"Form.Question"}>
            <Form.Label>
              <div className="ratio ratio-16x9">
                <ReactPlayer
                  url={`../images/${this.props.source}.MP4`}
                  width="100%"
                  height="100%"
                  playing={this.state.playing}
                  controls={this.state.controls}
                  onPlay={this.setPlaying}
                />
              </div>
              <div>
                <b>
                  Please transcribe what is said in the above video to the best
                  of your abilities.
                </b>
                <br></br>
                You have the whole 5 and a half minutes of this condition to
                complete this task. Once you have compelted the task wait for
                the condition to finish. The transcript will upload
                automatically. You must click the play button to start the
                video.
              </div>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              onChange={this.update_answers}
              disabled={this.props.disabled}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default VideoCap;
