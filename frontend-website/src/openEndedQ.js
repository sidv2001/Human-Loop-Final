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
      answer_complexity: this.props.config["answer_complexity"],
      question_difficulty: this.props.question_difficulty,
      interval: this.props.interval,
      user_busyness: this.props.user_busyness,
      time_taken: 0,
    },
    time_remaining: "00:01:00",
    completed: false,
  };

  static printTime = (time, last_call) => {
    let { total, hours, minutes, seconds } = this.getTimeRemaining(
      time,
      last_call
    );
    if (total >= 0) {
      return (
        (hours > 9 ? hours : "0" + hours) +
        ":" +
        (minutes > 9 ? minutes : "0" + minutes) +
        ":" +
        (seconds > 9 ? seconds : "0" + seconds)
      );
    } else {
      return "00:00:00";
    }
  };

  static getTimeRemaining = (time, last_call) => {
    const total = last_call - time;
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    if (total >= 0) {
      seconds = Math.floor((total / 1000) % 60);
      minutes = Math.floor((total / 1000 / 60) % 60);
      hours = Math.floor((total / 1000 / 60 / 60) % 24);
    }
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  setAnswer = (ans) => {
    const adapt_state = this.state;
    adapt_state.form.answer = ans;

    this.setState({ adapt_state });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const adapt_state = prevState;
    var printed_time = "";
    if (nextProps.time === nextProps.last_call) {
      adapt_state.completed = true;
    } else {
      printed_time = OpenEndedQ.printTime(nextProps.time, nextProps.last_call);
      adapt_state.time_remaining = printed_time;
      adapt_state.form.time_taken =
        60000 - (nextProps.last_call - nextProps.time);
    }
    return adapt_state;
  };

  update_answers = (event) => {
    this.setAnswer(event.target.value);
  };

  submitHandler = () => {
    var copy = {};
    Object.assign(copy, this.state.form);
    this.props.update_results(copy);
    this.props.update_display();
    this.state.completed = false;
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
    if (this.state.completed === true) {
      this.submitHandler();
    }
    return (
      <div>
        <div>
          Time remaining to submit this question: <br />
          <h4>{this.state.time_remaining}</h4>
        </div>
        <Form>
          <Form.Group
            className="mb-3"
            controlId={"Form.Question" + this.props.current_question.toString()}
          >
            <Form.Label>
              {this.displayContext()}
              <strong>{this.props.config["question"]}</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={this.update_answers}
            />
          </Form.Group>
          <Form.Text>
            Some of the consideration for acquiring food items are:
            <ul>
              <li>The angle of the fork</li>
              <li>The location of the fork</li>
              <li>How deep the fork should go inside the food item</li>
              <li>The direction of approach of the fork</li>
            </ul>
            <br />
            But feel free to let us know of any other considerations you have
            that may affect the success of acquisition. <br></br>
          </Form.Text>
          <Button variant="primary" type="submit" onClick={this.submitHandler}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default OpenEndedQ;
