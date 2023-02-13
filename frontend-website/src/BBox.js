import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import BBoxAnnotator from "react-bbox-annotator";
import "bootstrap/dist/css/bootstrap.min.css";
import MCQ from "./MCQ";

class BBox extends Component {
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
      Object.assign(copy, prevState.form);
      nextProps.update_results(copy);
      nextProps.update_display();
    } else {
      printed_time = BBox.printTime(nextProps.time, nextProps.last_call);
      adapt_state.time_remaining = printed_time;
    }
    return adapt_state;
  };

  update_answers = (event) => {
    console.log("answers_updating");
    this.setAnswer(event);
    console.log(this.state.form.answer);
  };

  submitHandler = () => {
    clearInterval(this.state.q_timer_id);
    var copy = {};
    Object.assign(copy, this.state.form);
    this.props.update_results(copy);
    this.props.update_display(false);
  };

  render() {
    return (
      <div>
        <div>
          Time remaining to submit this question: <br />
          <h4>{this.state.time_remaining}</h4>
        </div>
        <div>
          <strong>{this.props.config["question"]}</strong>
        </div>
        <BBoxAnnotator
          url={`../images/${this.props.config["context-source"]}.JPG`}
          inputMethod="select"
          labels={this.props.config["labels"]}
          onChange={(e) => this.update_answers(e)}
        />
        <div>
          {" "}
          If you do not like your box, hover the top left of the box and click
          the x to delete it{" "}
        </div>
        <Button variant="primary" type="submit" onClick={this.submitHandler}>
          Submit
        </Button>
      </div>
    );
  }
}

export default BBox;
