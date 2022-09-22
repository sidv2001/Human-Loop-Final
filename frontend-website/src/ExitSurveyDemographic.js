import React from "react";
import { Card, Button, Modal, Alert, Form } from "react-bootstrap";
import { getCompletionCode } from "./helpers";

export class ExitSurveyDemographic extends React.Component {
  constructor(props) {
    super(props);
    this.required_questions = [
      "age",
      "gender",
      "computer_prof",
      "feedback",
      "robots",
      "wheelchair",
      "feeding",
    ];
    this.state = {
      survey_results: {},
    };
  }

  handleSubmit() {
    for (const question_key of this.required_questions) {
      if (
        !(question_key in this.state.survey_results) ||
        this.state.survey_results[question_key] == "Please Select"
      ) {
        alert("Please answer all questions before continuing");
        return false;
      }
    }
    var data = {
      id: this.props.router.params.id,
      event_type: "demographic",
      survey_results: this.state.survey_results,
      completion_code: getCompletionCode(this.props.router.params.id),
      time: Date.now(),
    };
    console.log(data);
    fetch(this.props.server_url + "data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.text())
      .then((_) =>
        this.props.router.navigate(
          "/" + this.props.router.params.id + "/completionCode"
        )
      );
  }

  handleFormChange(key, val) {
    let { survey_results } = this.state;
    survey_results[key] = val;
    this.setState({ survey_results: survey_results });
  }

  render() {
    return (
      <div id="survey">
        <Modal size="xl" show={true} onHide={null}>
          <Modal.Header>
            <Modal.Title>Demographics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>
              <strong>
                Please answer the following demographic questions:
              </strong>
            </h5>
            <h5 class="required_description" style={{ textAlign: "left" }}>
              Required
            </h5>
            <Form>
              <Form.Group controlId="wheelchair">
                <Form.Label class="required_field">
                  Do you have a disability or impairment that requires you to
                  use a wheelchair?
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.handleFormChange("wheelchair", e.target.value)
                  }
                  as="select"
                >
                  <option>Please Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="feeding">
                <Form.Label class="required_field">
                  Have you ever fed someone who has a disability or impairment?
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.handleFormChange("feeding", e.target.value)
                  }
                  as="select"
                >
                  <option>Please Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="robots">
                <Form.Label class="required_field">
                  Have you ever worked with robots before?
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.handleFormChange("robots", e.target.value)
                  }
                  as="select"
                >
                  <option>Please Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="elaborate">
                <Form.Label>
                  If you are comfortable sharing, please elaborate on your
                  answers to the above questions.
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.handleFormChange("elaborate", e.target.value)
                  }
                />
              </Form.Group>
              <br />
              <Form.Group controlId="age">
                <Form.Label class="required_field">
                  What is your age?
                </Form.Label>
                <Form.Control
                  onChange={(e) => this.handleFormChange("age", e.target.value)}
                  as="select"
                >
                  <option>Please Select</option>
                  <option>0-15 years old</option>
                  <option>15-30 years old</option>
                  <option>30-45 years old</option>
                  <option>45-60 years old</option>
                  <option>60-75 years old</option>
                  <option>75+</option>
                  <option>Prefer Not to Answer</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label class="required_field">
                  To which gender identity do you most identify?
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.handleFormChange("gender", e.target.value)
                  }
                  as="select"
                >
                  <option>Please Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Transgender Female</option>
                  <option>Transgender Male</option>
                  <option>Gender Variant/Non-Conforming</option>
                  <option>Not Listed</option>
                  <option>Prefer Not to Answer</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="computer">
                <Form.Label class="required_field">
                  How proficient are you with computers?
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.handleFormChange("computer_prof", e.target.value)
                  }
                  as="select"
                >
                  <option>Please Select</option>
                  <option>Not at all</option>
                  <option>Basic</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="feedback">
                <Form.Label>
                  Is there any feedback about the study that you would like to
                  provide?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    this.handleFormChange("feedback", e.target.value)
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSubmit.bind(this)}>
              Finish
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
