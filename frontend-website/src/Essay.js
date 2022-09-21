import React, { Component } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class Essay extends Component {
  state = {};
  update_answers = (event) => {
    this.props.update_results({
      answer: event.target.value,
      busyness: 3,
      question: this.props.prompt,
    });
  };

  render() {
    return (
      <div>
        <Form>
          <Form.Group className="mb-3" controlId={"Form.Question"}>
            <Form.Label>
              <div>{this.props.prompt}</div>
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

export default Essay;
