import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";

class MCQ extends Component {
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
    time_remaining: "00:01:00",
    completed: false,
  };

  setTimeRemaining = (time) => {
    const adapt_state = this.state;
    adapt_state.time_remaining = time;
    this.setState({ adapt_state });
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
      var copy = {};
      adapt_state.completed = true;
    } else {
      printed_time = MCQ.printTime(nextProps.time, nextProps.last_call);
      adapt_state.time_remaining = printed_time;
      adapt_state.form.time_taken =
        60000 - (nextProps.last_call - nextProps.time);
    }
    return adapt_state;
  };

  updateChoice = (id) => {
    return (event) => {
      this.setAnswer(id);
      console.log(id, this.state.form.answer);
    };
  };

  submitHandler = () => {
    clearInterval(this.state.q_timer_id);
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
          <iframe
            src={this.props.config["context-source"]}
            title="YouTube video"
            allowFullScreen
          ></iframe>
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

  displayImage = (source) => {
    if (source === "None") {
      return <div></div>;
    } else {
      return <Image src={`../images/${source}.jpg`} fluid />;
    }
  };

  listOptions = () => {
    return (
      <div key={`default-radio`} className="mb-3">
        {this.props.config["options"].map((desc) => (
          <Form.Check
            type="radio"
            name="question-group"
            id={`option-${desc["id"]}`}
            key={`option-${desc["id"]}`}
            onChange={this.updateChoice(desc["id"])}
            label={
              <div>
                {this.displayImage(desc["image"])}
                {desc["text"]}
              </div>
            }
          />
        ))}
      </div>
    );
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
              <strong> {this.props.config["question"]} </strong>
            </Form.Label>
            {this.listOptions()}
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.submitHandler}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default MCQ;
