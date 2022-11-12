import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPlayer from "react-player";

class OpenEndedQ extends Component {
  state = {
    form: {
      question: this.props.config["question"],
      answer: null,
      time_taken: 0,
      answer_complexity: this.props.config["answer_complexity"],
      question_difficulty: this.props.question_difficulty,
      interval: this.props.interval,
      user_busyness: this.props.user_busyness,
    },
    q_timer_id: null,
  };

  setTimerId = (id) => {
    const adapt_state = this.state;
    adapt_state.q_timer_id = id;
    this.setState({ adapt_state });
  };

  setTimer = (time) => {
    const adapt_state = this.state;
    adapt_state.form.time_taken = time;

    this.setState({ adapt_state });
  };

  setAnswer = (ans) => {
    const adapt_state = this.state;
    adapt_state.form.answer = ans;

    this.setState({ adapt_state });
  };

  updateCurrentTime = () => {
    if (this.state.form.time_taken === 60000) {
      clearInterval(this.state.q_timer_id);
      var copy = {};
      Object.assign(copy, this.state.form);
      this.props.update_results(copy);
      this.props.update_display();
    } else {
      const adapt_state = this.state;
      adapt_state.form.time_taken += 100;
      this.setState({ adapt_state });
    }
  };

  startTimer = () => {
    const id = setInterval(() => {
      this.updateCurrentTime();
    }, 100);
    this.setTimerId(id);
  };

  componentDidMount = () => {
    this.startTimer();
  };

  update_answers = (event) => {
    this.setAnswer(event.target.value);
  };

  submitHandler = () => {
    clearInterval(this.state.q_timer_id);
    var copy = {};
    Object.assign(copy, this.state.form);
    this.props.update_results(copy);
    this.props.update_display();
  };

  displayContext = () => {
    if (this.props.config["context-type"] === "video") {
      return (
        <div className="ratio ratio-16x9">
          <ReactPlayer
            url={`../images/${this.props.config["context-source"]}.MP4`}
            width="100%"
            height="100%"
            controls
          />
        </div>
      );
    } else if (this.props.config["context-type"] === "image") {
      return (
        <div>
          <Image
            src={`../images/${this.props.config["context-source"]}.JPG`}
            fluid
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  render() {
    return (
      <div>
        <Form>
          <Form.Group
            className="mb-3"
            controlId={"Form.Question" + this.props.current_question.toString()}
          >
            <Form.Label>
              {this.displayContext()}
              {this.props.config["question"]}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={this.update_answers}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.submitHandler}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default OpenEndedQ;
