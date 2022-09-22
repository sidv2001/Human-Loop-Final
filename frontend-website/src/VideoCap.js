import React, { Component } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class VideoCap extends Component {
  state = {};

  update_answers = (event) => {
    this.props.update_results({
      answer: event.target.value,
      busyness: 3,
      question: this.props.source,
    });
  };

  render() {
    return (
      <div>
        <Form>
          <Form.Group className="mb-3" controlId={"Form.Question"}>
            <Form.Label>
              <div className="ratio ratio-16x9">
                <iframe
                  src={this.props.source}
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              </div>
              <div>
                Please transcribe what is said in the below video to the best of
                your abilities.
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
