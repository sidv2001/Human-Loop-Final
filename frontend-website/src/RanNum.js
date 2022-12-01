import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

class RanNum extends Component {
  state = {
    questions_asked: [],
    question_answers: [],
    current_question: [
      RanNum.getRandomInt(this.props.max),
      RanNum.getRandomInt(this.props.max),
      " + ",
    ],
    time_taken: [],
    current_question_number: 0,
    is_displayed: false,
    when_to_display: 2000,
    end_time: 0,
    end_timer_id: null,
    end_timer: "00:00:30",
    start_timer: false,
  };

  static getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  update_answers = (event) => {
    const adapt_state = this.state;
    adapt_state.question_answers[this.state.current_question_number] =
      event.target.value;
    this.setState({ adapt_state });
  };

  startEndTimer = () => {
    const id = setInterval(() => {
      this.updateEndTime();
    }, 1000);
    const adapt_state = this.state;
    adapt_state.end_time = 0;
    adapt_state.end_timer = "00:00:30";
    adapt_state.end_timer_id = id;
    adapt_state.start_timer = false;

    this.setState({ adapt_state });
  };

  getEndTimeRemaining = () => {
    const total = 30000 - this.state.end_time;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  printEndTime = () => {
    let { total, hours, minutes, seconds } = this.getEndTimeRemaining();
    if (total >= 0) {
      this.setEndTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };
  updateEndTime = () => {
    const adapt_state = this.state;
    adapt_state.end_time += 1000;
    this.setState({ adapt_state });
    this.printEndTime();
    console.log(this.state.end_time);
  };
  setEndTimer = (time) => {
    const adapt_state = this.state;
    adapt_state.end_timer = time;

    this.setState({ adapt_state });
  };
  setEndTime = (time) => {
    const adapt_state = this.state;
    adapt_state.end_time = time;

    this.setState({ adapt_state });
  };

  setEndTimerId = (time) => {
    const adapt_state = this.state;
    adapt_state.end_timer_id = time;
    this.setState({ adapt_state });
  };

  submitHandler = () => {
    const adapt_state = this.state;
    adapt_state.questions_asked.push(this.state.current_question);
    adapt_state.time_taken.push(this.state.end_time);
    adapt_state.current_question_number += 1;
    adapt_state.current_question = [
      RanNum.getRandomInt(this.props.max),
      RanNum.getRandomInt(this.props.max),
      " + ",
    ];
    adapt_state.is_displayed = false;
    this.props.update_results({
      questions_asked: adapt_state.questions_asked,
      question_answers: adapt_state.question_answers,
      time_taken: adapt_state.time_taken,
    });
    console.log(adapt_state, "submit handler");
    this.setState({ adapt_state });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const adapt_state = prevState;
    if (!prevState.is_displayed) {
      if (prevState.when_to_display === nextProps.time) {
        adapt_state.is_displayed = true;
        console.log(adapt_state, "reached false after submit loop");
        adapt_state.when_to_display += nextProps.interval;
        if (adapt_state.when_to_display > 300000) {
          adapt_state.when_to_display = 400000;
        }
        adapt_state.start_timer = true;
        return adapt_state;
      }
    } else {
      if (prevState.when_to_display - 1000 === nextProps.time) {
        adapt_state.questions_asked.push(adapt_state.current_question);
        adapt_state.time_taken.push(adapt_state.end_time);
        if (
          adapt_state.question_answers.length ===
          adapt_state.current_question_number
        ) {
          adapt_state.question_answers[adapt_state.current_question_number] =
            "Null";
        }
        adapt_state.current_question_number += 1;
        adapt_state.current_question = [
          RanNum.getRandomInt(nextProps.max),
          RanNum.getRandomInt(nextProps.max),
          " + ",
        ];
        adapt_state.is_displayed = false;
        nextProps.update_results({
          questions_asked: adapt_state.questions_asked,
          question_answers: adapt_state.question_answers,
          time_taken: adapt_state.time_taken,
        });
        console.log("reached inner loop");
        return adapt_state;
      }
    }
    return null;
  };
  render() {
    if (this.state.start_timer) {
      clearInterval(this.state.end_timer_id);
      this.setEndTimerId(null);
      this.startEndTimer();
    }
    if (this.state.is_displayed) {
      return (
        <div>
          {" "}
          <Form>
            <Form.Group className="mb-3" controlId={"Form.Question"}>
              <Form.Label>
                <div>
                  {" "}
                  Please add the below numbers. A new question will appear in 30
                  seconds. <br />
                  Time Remaining before next question:
                  <br />
                  <h4>{this.state.end_timer}</h4>
                  <h4>
                    {" "}
                    {this.state.current_question[0]}{" "}
                    {this.state.current_question[2]}{" "}
                    {this.state.current_question[1]}
                  </h4>
                </div>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                onChange={this.update_answers}
                disabled={this.props.disabled}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={this.submitHandler}
            >
              Submit
            </Button>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          Please add the below numbers. A new question will appear in 30
          seconds. <br />
          Time Remaining before next question:
          <br />
          <h4>{this.state.end_timer}</h4>
        </div>
      );
    }
  }
}

export default RanNum;
