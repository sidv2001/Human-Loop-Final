import React, { Component } from "react";
import MCQ from "./MCQ";
import OpenEndedQ from "./openEndedQ";
import BBox from "./BBox";
import "bootstrap/dist/css/bootstrap.min.css";

class MainQuestions extends Component {
  state = {
    current_question: 0,
    when_to_display: this.props.config["first question"],
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
    } else {
      if (prevState.last_call === nextProps.time) {
        adapt_state.is_displayed = false;
        adapt_state.current_question += 1;
        adapt_state.when_to_display =
          prevState.when_to_display + nextProps.config["interval"];
        console.log(adapt_state);
        return adapt_state;
      }
    }
    if (nextProps.time === 330000) {
      var copy = {};
      Object.assign(copy, adapt_state.results);
      nextProps.update_results(copy);
    }
    return null;
  };
  updateDisplay = () => {
    const adapt_state = this.state;
    adapt_state.is_displayed = false;
    adapt_state.current_question += 1;
    adapt_state.when_to_display += this.props.config["interval"];
  };

  renderQuestion = () => {
    if (this.state.is_displayed) {
      if (
        this.props.config["questions"][this.state.current_question]["type"] ===
        "open-ended"
      ) {
        return (
          <OpenEndedQ
            config={this.props.config["questions"][this.state.current_question]}
            current_question={this.state.current_question}
            update_results={this.updateResults}
            update_display={this.updateDisplay}
            user_busyness={this.props.config["busyness"]}
            interval={this.props.config["interval"]}
          ></OpenEndedQ>
        );
      } else if (
        this.props.config["questions"][this.state.current_question]["type"] ===
        "mcq"
      ) {
        return (
          <MCQ
            config={this.props.config["questions"][this.state.current_question]}
            current_question={this.state.current_question}
            update_results={this.updateResults}
            update_display={this.updateDisplay}
            user_busyness={this.props.config["busyness"]}
            interval={this.props.config["interval"]}
          ></MCQ>
        );
      } else if (
        this.props.config["questions"][this.state.current_question]["type"] ===
        "bbox"
      ) {
        return (
          <BBox
            config={this.props.config["questions"][this.state.current_question]}
            current_question={this.state.current_question}
            update_results={this.updateResults}
            update_display={this.updateDisplay}
            user_busyness={this.props.config["busyness"]}
            interval={this.props.config["interval"]}
          ></BBox>
        );
      } else {
        return <div></div>;
      }
    }
  };

  render() {
    return (
      <div>
        {" "}
        You have 60 seconds to answer the following question. Please click
        submit the moment you are done with you ranswer to the question.{" "}
        {this.renderQuestion()}
      </div>
    );
  }
}

export default MainQuestions;
