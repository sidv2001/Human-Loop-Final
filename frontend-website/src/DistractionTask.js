import React, { Component } from "react";
import Essay from "./Essay";
import RanNum from "./RanNum";
import VideoCap from "./VideoCap";
import "bootstrap/dist/css/bootstrap.min.css";

class DistractionTask extends Component {
  state = { results: null, disabled: false };

  setAnswer = (ans) => {
    const adapt_state = this.state;
    adapt_state.results = ans;

    this.setState({ adapt_state });
    console.log(this.state);
    var copy = {};
    Object.assign(copy, this.state.results);
    this.props.update_results(copy);
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const adapt_state = prevState;
    if (nextProps.time === 330000) {
      adapt_state.disabled = true;
    }
    return adapt_state;
  };

  generateTask = () => {
    if (this.props.config["busyness"] === 0) {
      return <div>There is no left-side task for this condition</div>;
    } else if (this.props.config["busyness"] === 1) {
      return (
        <RanNum
          max={this.props.config["max_number"]}
          interval={this.props.config["interval"]}
          disabled={this.state.disabled}
          update_results={this.setAnswer}
          time={this.props.time}
        ></RanNum>
      );
      // } else if (this.props.config["busyness"] === 2) {
      //   return (
      //     <Essay
      //       prompt={this.props.config["prompt"]}
      //       disabled={this.state.disabled}
      //       update_results={this.setAnswer}
      //     ></Essay>
      //   );
    } else if (this.props.config["busyness"] === 2) {
      return (
        <VideoCap
          source={this.props.config["source"]}
          disabled={this.state.disabled}
          update_results={this.setAnswer}
        ></VideoCap>
      );
    }
  };

  render() {
    return <div>{this.generateTask()}</div>;
  }
}

export default DistractionTask;
