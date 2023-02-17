import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import "./studyPage.css";
import DistractionTask from "./DistractionTask";
import MainQuestions from "./MainQuestions";
import { Button, ModalBody } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import Survey from "./Survey";

class StudyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: "00:05:30",
      total_time: 332000,
      current_time: 0,
      study_order: parseInt(this.props.router.params.study_part_i),
      current_condition: this.props.ordering(this.props.router.params.id)[
        parseInt(this.props.router.params.study_part_i)
      ],
      main_timer_id: null,
      user_id: this.props.router.params.id,
      experiment_start: true,
      main_task_results: null,
      distraction_task_results: null,
      survey_results: [],
      current_survey: 0,
      display_survey: false,
      end_time: 0,
      end_timer_id: null,
      end_timer: "00:00:30",
      survey_interval_id: null,
    };
  }

  updateSurvey = (results, current_survey) => {
    const adapt_state = this.state;
    adapt_state.survey_results[current_survey] = results;
    this.setState({ adapt_state });
    this.updateNextSurvey();
    this.restartTimer();
    this.setDisplay(false);
    console.log(this.state.survey_results);
  };

  setDisplay = (truth) => {
    this.setState({ display_survey: truth });
  };

  updateNextSurvey = () => {
    const adapt_state = this.state;
    adapt_state.current_survey += 1;
    this.setState({ adapt_state });
  };

  updateMain = (results) => {
    const adapt_state = this.state;
    adapt_state.main_task_results = results;

    this.setState({ adapt_state });
    console.log(this.state.main_task_results);
  };

  updateSide = (results) => {
    const adapt_state = this.state;
    adapt_state.distraction_task_results = results;
    this.setState({ adapt_state });
  };

  move_to = (study_part) => {
    if (study_part < 14) {
      this.props.router.navigate(
        "/" + this.state.user_id + "/study/" + study_part.toString()
      );
    } else {
      this.props.router.navigate("/" + this.state.user_id + "/final_survey");
    }
  };

  setTimerId = (id) => {
    const adapt_state = this.state;
    adapt_state.main_timer_id = id;
    this.setState({ adapt_state });
  };

  startSurvey = () => {
    const id = setInterval(() => {
      this.setDisplay(true);
      this.pauseTimer();
      clearInterval(this.state.survey_interval_id);
      this.setSurveyTimerId(null);
    }, 3000);
    this.setSurveyTimerId(id);
  };

  setSurveyTimerId = (id) => {
    const adapt_state = this.state;
    adapt_state.survey_interval_id = id;
    this.setState({ adapt_state });
  };

  setFinalSurvey = (val) => {
    const adapt_state = this.state;
    adapt_state.final_survey = val;
    this.setState({ adapt_state });
  };
  startFinalSurvey = () => {
    this.setDisplay(true);
    this.pauseTimer();
    this.setFinalSurvey(true);
  };

  setTimer = (time) => {
    const adapt_state = this.state;
    adapt_state.timer = time;

    this.setState({ adapt_state });
  };

  setEndTimer = (time) => {
    const adapt_state = this.state;
    adapt_state.end_timer = time;

    this.setState({ adapt_state });
  };

  setEndTimerId = (time) => {
    const adapt_state = this.state;
    adapt_state.end_timer_id = time;
    this.setState({ adapt_state });
  };

  studyCompletition = () => {
    clearInterval(this.state.end_timer_id);
    const results = {
      id: this.state.user_id,
      study_condition: this.state.current_condition,
      study_order: this.state.study_order,
      main_task_results: this.state.main_task_results,
      distraction_task_results: this.state.distraction_task_results,
      survey_results: this.state.survey_results,
    };
    console.log(results);
    fetch(this.props.server_url + "data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    });
    this.move_to(parseInt(this.props.router.params.study_part_i) + 1);
  };

  updateEndTime = () => {
    if (this.state.end_time === 30000) {
      this.studyCompletition();
    } else {
      const adapt_state = this.state;
      adapt_state.end_time += 1000;
      this.setState({ adapt_state });
      this.printEndTime();
      console.log(this.state.end_time);
    }
  };
  setStart = (truth) => {
    const adapt_state = this.state;
    adapt_state.experiment_start = truth;

    this.setState({ adapt_state });
  };

  updateCurrentTime = () => {
    if (this.state.current_time === this.state.total_time) {
      clearInterval(this.state.main_timer_id);
      this.startEndTimer();
    } else {
      const adapt_state = this.state;
      adapt_state.current_time += 1000;
      this.setState({ adapt_state });
      this.printTime();
      this.updateSurveyCondition();
    }
  };

  getTimeRemaining = () => {
    const total = 330000 - this.state.current_time;
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

  printTime = () => {
    let { total, hours, minutes, seconds } = this.getTimeRemaining();
    if (total >= 0) {
      this.setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  pauseTimer = () => {
    clearInterval(this.state.main_timer_id);
    this.setTimerId(null);
  };

  restartTimer = () => {
    const id = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
    this.setTimerId(id);
  };

  startTimer = () => {
    const id = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
    this.setTimerId(id);
    this.setStart(false);
  };

  startEndTimer = () => {
    const id = setInterval(() => {
      this.updateEndTime();
    }, 1000);
    this.setEndTimerId(id);
  };

  updateSurveyCondition = () => {
    if (this.state.current_time === this.state.total_time - 1000) {
      this.startFinalSurvey();
    }
  };

  displayStudy = () => {
    if (this.state.experiment_start) {
      return (
        <div>
          <div class="row justify-content-center">
            <Card style={{ width: "80rem" }}>
              <Card.Body>
                <Card.Title>
                  Condition {this.state.study_order + 1} out of 14 Instructions
                </Card.Title>
                <Card.Text class="justify-content-left">
                  <div>
                    In this <b>condition</b> you will be completing{" "}
                    <b>two tasks</b>, one on the left-side of the screen and one
                    on the right-side of the screen.
                    <ListGroup as="ol" numbered>
                      <ListGroup.Item as="li">
                        The left-side task will be present for the entire
                        duration of the timer{" "}
                        {"(or there might not be a left-side task)"}.<br></br>{" "}
                        The right-side task(s) will appear occasionally.
                      </ListGroup.Item>
                      <ListGroup.Item as="li">
                        You will be asked two types of surveys during the
                        condition. <br></br>The first will be asked
                        intermittently between your tasks about your{" "}
                        <b>current cognitive workload</b>. <br></br>
                        The second will be asked at the end of the condition,
                        about your{" "}
                        <b>
                          average cognitive workload throughout the condition
                        </b>{" "}
                        (the last 5.5 minutes)
                      </ListGroup.Item>
                      <ListGroup.Item as="li">
                        Your goal is to complete all the tasks as accurately as
                        possible within the allotted time. <br></br>
                        <b>
                          You will NOT be paid if you don’t attempt to complete
                          the tasks accurately.
                        </b>
                      </ListGroup.Item>
                      <ListGroup.Item as="li">
                        There is one main timer (shown above) that tells you how
                        much time is left in the condition. <br></br>
                        Additionally, some questions have timers which indicate
                        how much time you have to answer that specific question.
                      </ListGroup.Item>
                      <ListGroup.Item as="li">
                        Periodically, you will be asked to complete a brief
                        survey. <b>You MUST complete the survey to proceed.</b>{" "}
                        <br></br>
                        The timer will be paused for the duration of the survey.
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </Card.Text>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={this.startTimer}
                >
                  {" "}
                  Start Study{" "}
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    } else {
      if (this.state.current_time === this.state.total_time) {
        return (
          <div>
            <Modal
              show={true}
              backdrop="static"
              keyboard={false}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title>Condition Completed</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  We have submitted your responses, and you have 30 seconds
                  until you are redirected to the next page. <br /> If you feel
                  like you are ready to move to the next section click the
                  button below this.
                  <br />
                  <center>
                    Break Time Remaining <br />
                    <h2>{this.state.end_timer}</h2>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.studyCompletition}
                    >
                      Move to next condition
                    </Button>
                  </center>
                </div>
                <br />
                <div></div>
              </Modal.Body>
            </Modal>
          </div>
        );
      } else {
        return (
          <div>
            <Survey
              update_results={this.updateSurvey}
              enabled={this.state.display_survey}
              current_survey={this.state.current_survey}
              final={this.state.final_survey}
            ></Survey>
            <div className="container">
              <div className="row">
                <div className="col-sm border-10">
                  <DistractionTask
                    config={
                      this.props.config[this.state.current_condition][
                        "side-task"
                      ]
                    }
                    time={this.state.current_time}
                    update_results={this.updateSide}
                  ></DistractionTask>
                </div>
                <div className="col-sm border-10">
                  <MainQuestions
                    config={
                      this.props.config[this.state.current_condition][
                        "main-task"
                      ]
                    }
                    user_id={this.state.user_id}
                    time={this.state.current_time}
                    update_results={this.updateMain}
                    start_survey={this.startSurvey}
                  ></MainQuestions>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  render() {
    return (
      <div>
        <div className="Timer">
          <h2>{this.state.timer}</h2>
          {this.displayStudy()}
        </div>
      </div>
    );
  }
}

export default StudyPage;
