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
    current_question_number: 0,
    is_displayed: false,
    when_to_display: 2000,
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

  submitHandler = () => {
    const adapt_state = this.state;
    adapt_state.questions_asked.push(this.state.current_question);
    adapt_state.current_question_number += 1;
    adapt_state.current_question = [
      RanNum.getRandomInt(this.props.max),
      RanNum.getRandomInt(this.props.max),
      " + ",
    ];
    adapt_state.is_displayed = false;
    adapt_state.when_to_display += this.props.interval;
    this.props.update_results({
      questions_asked: adapt_state.questions_asked,
      question_answers: adapt_state.question_answers,
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
        return adapt_state;
      }
    } else {
      if (prevState.when_to_display - 1000 === nextProps.time) {
        adapt_state.questions_asked.push(adapt_state.current_question);
        adapt_state.question_answers[adapt_state.current_question_number] =
          "Null";
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
        });
        console.log(adapt_state, "reached inner loop");
        return adapt_state;
      }
    }
    return null;
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
                  {" "}
                  Please add the below numbers. A new question will appear in 30
                  seconds. <br />
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
      return <div></div>;
    }
  }
}

export default RanNum;
