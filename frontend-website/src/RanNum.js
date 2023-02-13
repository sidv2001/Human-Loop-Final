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
    final_question: false,
    end_timer: "00:00:30",
    end_time: 0,
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

  static getTimeRemaining = (time, last_call) => {
    const total = last_call - time;
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
    var printed_time = "";
    if (!prevState.is_displayed) {
      if (prevState.when_to_display === nextProps.time) {
        adapt_state.is_displayed = true;
        adapt_state.when_to_display += nextProps.interval;
        if (adapt_state.when_to_display > 300000) {
          adapt_state.when_to_display = 330000;
          adapt_state.final_question = true;
        }
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
      }
    }
    printed_time = RanNum.printTime(nextProps.time, prevState.when_to_display);
    adapt_state.end_timer = printed_time;
    adapt_state.end_time =
      nextProps.time - prevState.when_to_display + nextProps.interval;
    return adapt_state;
  };

  print_inbw_timer = () => {
    if (this.state.final_question) {
      return (
        <div>
          {" "}
          <h4>This was the final question </h4>
        </div>
      );
    } else {
      return (
        <div>
          A new question will appear in 30 seconds. <br />
          Time Remaining before next question:
          <br />
          <h4>{this.state.end_timer}</h4>
        </div>
      );
    }
  };
  print_during_timer = () => {
    if (this.state.final_question) {
      return (
        <div>
          {" "}
          Please add the below numbers. A new question will appear in 30
          seconds. <br />
          <h4>This is the final question </h4>
          Time Remaining to complete this question:
          <br />
          <h4>{this.state.end_timer}</h4>
        </div>
      );
    } else {
      return (
        <div>
          {" "}
          Please add the below numbers. A new question will appear in 30
          seconds. <br />
          Time Remaining before next question:
          <br />
          <h4>{this.state.end_timer}</h4>
        </div>
      );
    }
  };
  render() {
    if (this.state.is_displayed) {
      return (
        <div>
          {" "}
          <Form>
            <Form.Group className="mb-3" controlId={"Form.Question"}>
              <Form.Label>
                <div>
                  {this.print_during_timer()}
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
      return this.print_inbw_timer();
    }
  }
}

export default RanNum;
