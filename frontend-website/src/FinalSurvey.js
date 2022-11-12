import React from "react";
import { Card, Button, Modal, Alert, Form } from "react-bootstrap";

export class FinalSurvey extends React.Component {
  constructor(props) {
    super(props);
    this.required_questions = [
      "stress_factors",
      "attention_factors",
      "task_difficulty",
      "multitask_impact",
      "right_task_impact",
      "diff_task",
      "perference",
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
      event_type: "Final Survey",
      survey_results: this.state.survey_results,
    };
    console.log(data);
    fetch(this.props.server_url + "data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    this.props.router.navigate(
      "/" + this.props.router.params.id + "/demographic"
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
                Please answer the following questions on the study you just
                completed:
              </strong>
            </h5>
            <h5 class="required_description" style={{ textAlign: "left" }}>
              Required
            </h5>
            <Form>
              <Form.Group className="mb-3" controlId="stress_factors">
                <Form.Label>
                  What factors impacted your stress levels during the tasks?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    this.handleFormChange("stress_factors", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="attention_factors">
                <Form.Label>
                  What factors affected your attention towards a particular
                  task?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    this.handleFormChange("attention_factors", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="task_difficulty">
                <Form.Label>
                  Which of these tasks were harder, the left side or the right
                  side?
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) =>
                    this.handleFormChange("task_difficulty", e.target.value)
                  }
                >
                  <option>Please Select</option>
                  <option>Left</option>
                  <option>Right</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="multitask_impact">
                <Form.Label>
                  Did multitasking affect your attention towards the left hand
                  side task?
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) =>
                    this.handleFormChange("multitask_impact", e.target.value)
                  }
                >
                  <option>Please Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="right_task_impact">
                <Form.Label>
                  Which right-hand side task made it the most difficult to do
                  the left-hand task?
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) =>
                    this.handleFormChange("right_task_impact", e.target.value)
                  }
                >
                  <option>Please Select</option>
                  <option>MCQs</option>
                  <option>Bounding Boxes</option>
                  <option>Open Ended Questions</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="diff_task">
                <Form.Label>
                  Was there any task that was particulary hard?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    this.handleFormChange("diff_task", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="perference">
                <Form.Label>
                  Imagine this robot helping you with a task. Would you prefer a
                  robot that always successfully performs a task by asking you
                  how to do the task every time or a robot that does not ask you
                  all the time but occasionally fails? Please elaborate.{" "}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    this.handleFormChange("perference", e.target.value)
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
