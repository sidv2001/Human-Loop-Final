import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import "./studyPage.css";
import DistractionTask from "./DistractionTask";
import MainQuestions from "./MainQuestions";
import { Button, ModalBody } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

import Survey from "./Survey";

class StudyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: "00:05:32",
      total_time: 2000,
      current_time: 0,
      study_order: parseInt(this.props.router.params.study_part_i),
      current_condition:
        this.props.ordering[parseInt(this.props.router.params.study_part_i)],
      main_timer_id: null,
      user_id: this.props.router.params.id,
      experiment_start: true,
      main_task_results: null,
      distraction_task_results: null,
      survey_results: [],
      survey_timer:
        this.props.config[
          this.props.ordering[parseInt(this.props.router.params.study_part_i)]
        ]["main-task"]["first survey"],
      current_survey: 0,
      display_survey: false,
      end_time: 0,
      end_timer_id: null,
      end_timer: "00:00:30",
    };
  }

  updateSurvey = (results, current_survey) => {
    const adapt_state = this.state;
    adapt_state.survey_results[current_survey] = results;
    this.setState({ adapt_state });
    this.updateNextSurvey();
    this.restartTimer();
    this.setDisplay(false);
  };

  setDisplay = (truth) => {
    this.setState({ display_survey: truth });
  };

  updateNextSurvey = () => {
    const adapt_state = this.state;
    adapt_state.survey_timer +=
      this.props.config[this.state.current_condition]["main-task"]["interval"];
    adapt_state.current_survey += 1;
    this.setState({ adapt_state });
  };

  updateMain = (results) => {
    const adapt_state = this.state;
    adapt_state.main_task_results = results;
    this.setState({ adapt_state });
  };

  updateSide = (results) => {
    const adapt_state = this.state;
    adapt_state.distraction_task_results = results;
    this.setState({ adapt_state });
  };

  move_to = (study_part) => {
    this.props.router.navigate(
      "/" + this.state.user_id + "/study/" + study_part.toString()
    );
  };

  setTimerId = (id) => {
    const adapt_state = this.state;
    adapt_state.main_timer_id = id;
    this.setState({ adapt_state });
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
    const total = this.state.total_time - this.state.current_time;
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
    if (this.state.current_time === this.state.survey_timer) {
      this.setDisplay(true);
      this.pauseTimer();
    }
  };

  displayStudy = () => {
    if (this.state.experiment_start) {
      return (
        <div>
          <Button variant="primary" type="submit" onClick={this.startTimer}>
            Start
          </Button>
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
                    time={this.state.current_time}
                    update_results={this.updateMain}
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
