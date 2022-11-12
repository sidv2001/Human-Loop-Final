import React, { Component } from "react";
import MCQ from "./MCQ";
import OpenEndedQ from "./openEndedQ";
import BBox from "./BBox";
import "bootstrap/dist/css/bootstrap.min.css";
import { shuffle, mulberry32, cyrb53 } from "./helpers";

function generateRandomOrdering(id, length) {
  var seed = cyrb53(id);
  var rand = mulberry32(seed);
  const order = [...Array(length).keys()];
  shuffle(order, rand);
  console.log("FINAL_QUESTION_ORDERING", order);
  return order;
}

class MainQuestions extends Component {
  state = {
    current_question: 0,
    when_to_display: this.props.config["first question"],
    ordering: generateRandomOrdering(
      this.props.user_id,
      this.props.config["questions"].length
    ),
    last_call: 0,
    is_displayed: false,
    results: [],
  };

  setDisplay = (truth) => {
    const adapt_state = this.state;
    adapt_state.is_displayed = truth;
    this.setState({ adapt_state });
  };

  updateResults = (question_results) => {
    this.setResults(question_results, this.state.current_question);
    console.log(this.state.results);
    var copy = {};
    Object.assign(copy, this.state.results);
    this.props.update_results(copy);
  };

  setResults = (results, current_question) => {
    const adapt_state = this.state;
    adapt_state.results[current_question] = results;
    console.log(
      adapt_state.results,
      this.state.results,
      this.state.current_question
    );
    this.setState({ adapt_state });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const adapt_state = prevState;
    if (!prevState.is_displayed) {
      if (
        prevState.when_to_display === nextProps.time &&
        nextProps.time < 301000
      ) {
        adapt_state.is_displayed = true;
        adapt_state.last_call = prevState.when_to_display + 59000;
        return adapt_state;
      }
    }
    return null;
  };
  updateDisplay = () => {
    console.log("reached here");
    const adapt_state = this.state;
    adapt_state.is_displayed = false;
    adapt_state.current_question += 1;
    adapt_state.when_to_display += this.props.config["interval"];
    this.setState({ adapt_state });
    this.props.start_survey();
  };

  renderQuestion = () => {
    const during_task_instruction = (
      <div>
        Please answer the below question in 60 seconds. Click “Submit” the
        moment you are done.
      </div>
    );
    if (this.state.is_displayed) {
      if (
        this.props.config["questions"][
          this.state.ordering[this.state.current_question]
        ]["type"] === "open-ended"
      ) {
        return (
          <div>
            {during_task_instruction}
            <OpenEndedQ
              config={
                this.props.config["questions"][
                  this.state.ordering[this.state.current_question]
                ]
              }
              current_question={this.state.current_question}
              update_results={this.updateResults}
              update_display={this.updateDisplay}
              user_busyness={this.props.config["busyness"]}
              question_difficulty={this.props.config["question_difficulty"]}
              interval={this.props.config["interval"]}
            ></OpenEndedQ>
          </div>
        );
      } else if (
        this.props.config["questions"][
          this.state.ordering[this.state.current_question]
        ]["type"] === "mcq"
      ) {
        return (
          <div>
            {during_task_instruction}
            <MCQ
              config={
                this.props.config["questions"][
                  this.state.ordering[this.state.current_question]
                ]
              }
              current_question={this.state.current_question}
              update_results={this.updateResults}
              update_display={this.updateDisplay}
              user_busyness={this.props.config["busyness"]}
              question_difficulty={this.props.config["question_difficulty"]}
              interval={this.props.config["interval"]}
            ></MCQ>
          </div>
        );
      } else if (
        this.props.config["questions"][
          this.state.ordering[this.state.current_question]
        ]["type"] === "bbox"
      ) {
        return (
          <div>
            {during_task_instruction}
            <BBox
              config={
                this.props.config["questions"][
                  this.state.ordering[this.state.current_question]
                ]
              }
              current_question={this.state.current_question}
              update_results={this.updateResults}
              update_display={this.updateDisplay}
              user_busyness={this.props.config["busyness"]}
              question_difficulty={this.props.config["question_difficulty"]}
              interval={this.props.config["interval"]}
            ></BBox>
          </div>
        );
      } else {
        return <div></div>;
      }
    }
  };

  display_pre_task = () => {
    if (!this.state.is_displayed) {
      return (
        <div>
          A question may appear here occasionally. You will have 60 seconds to
          answer it. Click “Submit” when you are done.
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        {this.display_pre_task()}
        {this.renderQuestion()}
      </div>
    );
  }
}

export default MainQuestions;
