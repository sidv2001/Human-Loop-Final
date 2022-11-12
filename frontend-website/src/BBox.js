import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import BBoxAnnotator from "react-bbox-annotator";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <div>{this.props.config["question"]}</div>
        <div>
          If you feel like your bounding box is not correct, hover the top left
          of the drawn box and click the x to delete your current box.{" "}
        </div>
        <BBoxAnnotator
          url={`../images/${this.props.config["context-source"]}.JPG`}
          inputMethod="select"
          labels={this.props.config["labels"]}
          onChange={(e) => this.update_answers(e)}
        />
        <Button variant="primary" type="submit" onClick={this.submitHandler}>
          Submit
        </Button>
      </div>
    );
  }
}

export default BBox;
