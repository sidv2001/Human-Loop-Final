import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";

class Instructions extends Component {
  state = {
    id: this.props.router.params.id,
    stress_level: null,
    display_alert: false,
  };

  setStress = (value) => {
    return (event) => {
      this.setState({ stress_level: value });
    };
  };
  setDisplay = (alert) => {
    this.setState({ display_alert: alert });
  };

  displayAlert = () => {
    if (this.state.display_alert) {
      return (
        <Alert
          variant="danger"
          onClose={() => this.setAlert(false)}
          dismissible
        >
          <Alert.Heading>
            Please answer all the questions before trying to submit{" "}
          </Alert.Heading>
          <p>
            You have not answered one of the parts of the Pre-Study Survey.
            Please answer it before moving on.
          </p>
        </Alert>
      );
    } else {
      return <div></div>;
    }
  };

  handleSubmit = () => {
    if (this.state.stress_level === null) {
      this.setDisplay(true);
    } else {
      this.pre_survey_completition();
      this.moveToStudy();
    }
  };

  pre_survey_completition = () => {
    const results = {
      id: this.state.id,
      initial_stress_levels: this.state.stress_level,
    };
    console.log(results);
    fetch(this.props.server_url + "data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    });
  };

  getLikertQuestion(key, onChange, word) {
    return (
      <React.Fragment>
        <div key="inline-radio">
          <div class="row align-items-center">
            <div class="col">
              <Form.Check.Label>Not at all {word}</Form.Check.Label>
            </div>
            <div class="col">
              <Form.Check.Label>Mildly {word}</Form.Check.Label>
            </div>
            <div class="col">
              <Form.Check.Label>Moderately {word}</Form.Check.Label>
            </div>
            <div class="col">
              <Form.Check.Label> Quite {word}</Form.Check.Label>
            </div>
            <div class="col">
              <Form.Check.Label> Very {word}</Form.Check.Label>
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col">
              <Form.Check
                inline
                name={key}
                type="radio"
                id={`Strongly Disagree`}
                onChange={onChange(0)}
              />
            </div>
            <div class="col">
              <Form.Check
                inline
                name={key}
                type="radio"
                id={`Somewhat Disagree`}
                onChange={onChange(1)}
              />
            </div>
            <div class="col">
              <Form.Check
                inline
                name={key}
                type="radio"
                id={`Neither Agree Nor Disagree`}
                onChange={onChange(2)}
              />
            </div>
            <div class="col">
              <Form.Check
                inline
                name={key}
                type="radio"
                id={`Somewhat Agree`}
                onChange={onChange(3)}
              />
            </div>
            <div class="col">
              <Form.Check
                inline
                name={key}
                type="radio"
                id={`Strongly Agree`}
                onChange={onChange(4)}
              />
            </div>
          </div>
        </div>
        <br />
      </React.Fragment>
    );
  }

  moveToStudy = () => {
    this.props.router.navigate("/" + this.props.router.params.id + "/study/0");
  };

  render() {
    return (
      <div class="row justify-content-center">
        {this.displayAlert()}
        <Card style={{ width: "60rem" }}>
          <Card.Body>
            <Card.Title>Cognitive Workload of Multitasking Study</Card.Title>
            <Card.Body>
              <div class="justify-content-left">
                <div class="justify-content-left">
                  For this study you will be asked to complete multiple tasks
                  simultaneously and fill out questionnaires about your
                  cognitive workload during these tasks.<br></br>
                  <br></br> Through this study we are interested in studying the
                  impact of the different tasks and when they are presented on a
                  person's cognitive workload. Each condition will show you a
                  slightly differnt combination of tasks and tasks timings to
                  study each individual factor.{" "}
                </div>
                <ListGroup as="ol" numbered>
                  <ListGroup.Item as="li">
                    You will complete 14 conditions that are 5 minutes and 30
                    seconds long. <br></br>In each <b>condition</b>, you will be
                    asked to complete two different <b>tasks</b> on the right
                    and left side of your screen{" "}
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    For each condition, we want you to do these tasks while
                    keeping in mind how difficult or easy they are to do,
                    relative to other conditions.{" "}
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    After all the conditions, you will be asked to complete two
                    final questionnaires. <br></br>
                    You will then receive a code to submit on Amazon Mechanical
                    Turk.
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    <b>
                      You will NOT be paid unless you submit the completion code
                      on Amazon Mechanical Turk.
                    </b>{" "}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Body>
          </Card.Body>
        </Card>
        <br></br>
        <Card style={{ width: "50rem" }}>
          <Card.Title>Pre Study Question</Card.Title>
          <Card.Text>
            Before continuing please answer the question given below:
          </Card.Text>
          <Card.Text>
            <b>How stressed do you feel right now?</b>
          </Card.Text>
          <Card.Text>
            {this.getLikertQuestion("Stress", this.setStress, "Stressed")}
          </Card.Text>
          <Button variant="primary" onClick={this.handleSubmit}>
            Submit Pre-Survey and Start
          </Button>
        </Card>
      </div>
    );
  }
}

export default Instructions;
