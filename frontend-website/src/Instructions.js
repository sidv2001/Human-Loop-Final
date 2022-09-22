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

class Instructions extends Component {
  state = {};

  moveToStudy = () => {
    this.props.router.navigate("/" + this.props.router.params.id + "/study/0");
  };

  render() {
    return (
      <div class="row justify-content-center">
        <Card style={{ width: "50rem" }}>
          <Card.Body>
            <Card.Title>Cognitive Workload of Multitasking Survey</Card.Title>
            <Card.Text class="row justify-content-left">
              <div>
                For this HIT we will be asking you to complete multiple tasks
                simultaneously and be asked about your workload while trying to
                complete these tasks.
                <ListGroup as="ol" numbered>
                  <ListGroup.Item as="li">
                    From here will be directed to a series of conditions. In
                    total, you will complete 15 conditions..{" "}
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    After all the conditions, you will be asked to complete two
                    final surveys. You will then receive a code to submit on
                    Amazon Mechanical Turk.{" "}
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    On average, this task takes 90-100 minutes{" "}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Text>
            <Button variant="primary" type="submit" onClick={this.moveToStudy}>
              {" "}
              Start Study{" "}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Instructions;
