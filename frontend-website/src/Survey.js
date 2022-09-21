import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

class Survey extends Component {
  state = {
    results: {
      mental: null,
      temporal: null,
      performance: null,
      effort: null,
      frustration: null,
    },
    mental: 0,
    temporal: 0,
    performance: 0,
    effort: 0,
    frustration: 0,
    display_alert: false,
    display_modal: this.props.enabled,
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const adapt_state = prevState;
    if (nextProps.enabled === adapt_state.display_modal) {
      return null;
    } else {
      adapt_state.display_modal = nextProps.enabled;

      return adapt_state;
    }
  };

  setAlert = (truth) => {
    const adapt_state = this.state;
    adapt_state.display_alert = truth;
    this.setState({ adapt_state });
  };

  handleSubmit = () => {
    const notNull = (value) => value != null;
    if (Object.values(this.state.results).every(notNull)) {
      this.props.update_results(this.state.results, this.props.current_survey);
      const reset_res = {
        results: {
          mental: null,
          temporal: null,
          performance: null,
          effort: null,
          frustration: null,
        },
        mental: 0,
        temporal: 0,
        performance: 0,
        effort: 0,
        frustration: 0,
      };
      this.setState(reset_res);
    } else {
      this.setAlert(true);
    }
  };

  setMental = (value) => {
    const adapt_state = this.state;
    adapt_state.mental = value;
    adapt_state.results.mental = value;
    this.setState({ adapt_state });
  };

  setTemporal = (value) => {
    const adapt_state = this.state;
    adapt_state.temporal = value;
    adapt_state.results.temporal = value;
    this.setState({ adapt_state });
  };

  setPerformance = (value) => {
    const adapt_state = this.state;
    adapt_state.performance = value;
    adapt_state.results.performance = value;
    this.setState({ adapt_state });
  };

  setEffort = (value) => {
    const adapt_state = this.state;
    adapt_state.effort = value;
    adapt_state.results.effort = value;
    this.setState({ adapt_state });
  };

  setFrustration = (value) => {
    const adapt_state = this.state;
    adapt_state.frustration = value;
    adapt_state.results.frustration = value;
    this.setState({ adapt_state });
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
            You have failed to answer one of the parts of the survey. Please
            answer it before moving on.
          </p>
        </Alert>
      );
    } else {
      return <div></div>;
    }
  };

  displayModal = () => {
    return (
      <div>
        <Modal
          show={this.state.display_modal}
          backdrop="static"
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title>Cognitive Workload Survey</Modal.Title>
            {this.displayAlert()}
          </Modal.Header>
          <Modal.Body>
            <div>
              Please tell us from a scale of 0 (very low) to 100 (very high),
              how demanding your workload felt for the tasks you did:
            </div>
            <br />
            <div>
              <Form>
                <Form.Group as={Row}>
                  <Form.Label>
                    <b>Mental Demand</b>: {"\n"} How mentally demanding was the
                    task?
                  </Form.Label>
                  <Col xs="9">
                    <Form.Range
                      value={this.state.mental}
                      onChange={(e) => this.setMental(e.target.value)}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Control value={this.state.mental} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label>
                    <b>Temporal Demand </b>: {"\n"} How hurried or rushed was
                    the pace of the task?
                  </Form.Label>
                  <Col xs="9">
                    <Form.Range
                      value={this.state.temporal}
                      onChange={(e) => this.setTemporal(e.target.value)}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Control value={this.state.temporal} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label>
                    <b>Performance</b>: {"\n"} How successful were you in
                    accomplishing what you were asked to do?
                  </Form.Label>
                  <Col xs="9">
                    <Form.Range
                      value={this.state.performance}
                      onChange={(e) => this.setPerformance(e.target.value)}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Control value={this.state.performance} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label>
                    <b>Effort</b>: {"\n"} How hard did you have to work to
                    accomplish your level of performance?
                  </Form.Label>
                  <Col xs="9">
                    <Form.Range
                      value={this.state.effort}
                      onChange={(e) => this.setEffort(e.target.value)}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Control value={this.state.effort} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label>
                    <b>Frustration</b>: {"\n"} How irritated, stressed, and
                    annoyed were you?
                  </Form.Label>
                  <Col xs="9">
                    <Form.Range
                      value={this.state.frustration}
                      onChange={(e) => this.setFrustration(e.target.value)}
                    />
                  </Col>
                  <Col xs="3">
                    <Form.Control value={this.state.frustration} />
                  </Col>
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  render() {
    return this.displayModal();
  }
}

export default Survey;
