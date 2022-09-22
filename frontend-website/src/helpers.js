import React from "react";
import { Card, Button, Modal, Alert, Form } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

export function getYAMLAsObject(filepath) {
  const yaml = require("js-yaml");

  return fetch(filepath)
    .then(function (response) {
      // The API call was successful!
      return response.text();
    })
    .then(function (html) {
      // This is the HTML from our response as a text string
      return yaml.load(html);
    });
}

export function getSliderQuestion(question, key, required, onChange) {
  return (
    <React.Fragment>
      <div>
        {required ? (
          <h5
            class="required_field"
            style={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: question }}
          ></h5>
        ) : (
          <h5
            style={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: question }}
          ></h5>
        )}
        <br />
        <div
          style={{ width: "100%", overflow: "hidden", marginBottom: "0.5%" }}
        >
          <div style={{ width: "33%", float: "left", textAlign: "left" }}>
            {" "}
            Strongly Disagree{" "}
          </div>
          <div style={{ width: "33%", margin: "0 auto", textAlign: "center" }}>
            {" "}
            Neutral{" "}
          </div>
          <div style={{ width: "33%", float: "right", textAlign: "right" }}>
            {" "}
            Strongly Agree{" "}
          </div>
        </div>
        <div style={{ width: "100%", overflow: "hidden", marginBottom: "2%" }}>
          <div style={{ width: "33%", float: "left", textAlign: "left" }}>
            {" "}
            |{" "}
          </div>
          <div style={{ width: "33%", margin: "0 auto", textAlign: "center" }}>
            {" "}
            |{" "}
          </div>
          <div style={{ width: "33%", float: "right", textAlign: "right" }}>
            {" "}
            |{" "}
          </div>
        </div>
        <RangeSlider
          value={this.state[key]}
          onChange={onChange}
          tooltip="off"
          step={2}
        />
      </div>
      <br />
    </React.Fragment>
  );
}

export function getOpenEndedQuestion(question, key, required, onChange) {
  return (
    <React.Fragment>
      <div>
        {required ? (
          <h5
            class="required_field"
            style={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: question }}
          ></h5>
        ) : (
          <h5
            style={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: question }}
          ></h5>
        )}
        <br />
        <Form.Group controlId={key}>
          <Form.Control onChange={onChange} />
        </Form.Group>
      </div>
      <br />
    </React.Fragment>
  );
}

export function getLikertQuestion(question, key, required, onChange, checked) {
  return (
    <React.Fragment>
      <div key="inline-radio">
        {required ? (
          <h5
            class="required_field"
            style={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: question }}
          ></h5>
        ) : (
          <h5
            style={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: question }}
          ></h5>
        )}
        <div class="row align-items-center">
          <div class="col">
            <Form.Check.Label>Strongly Disagree</Form.Check.Label>
          </div>
          <div class="col">
            <Form.Check.Label>Somewhat Disagree</Form.Check.Label>
          </div>
          <div class="col">
            <Form.Check.Label>Neither Agree Nor Disagree</Form.Check.Label>
          </div>
          <div class="col">
            <Form.Check.Label>Somewhat Agree</Form.Check.Label>
          </div>
          <div class="col">
            <Form.Check.Label>Strongly Agree</Form.Check.Label>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col">
            <Form.Check
              inline
              name={key}
              type="radio"
              id={`Strongly Disagree`}
              onChange={onChange}
              checked={checked("Strongly Disagree")}
            />
          </div>
          <div class="col">
            <Form.Check
              inline
              name={key}
              type="radio"
              id={`Somewhat Disagree`}
              onChange={onChange}
              checked={checked("Somewhat Disagree")}
            />
          </div>
          <div class="col">
            <Form.Check
              inline
              name={key}
              type="radio"
              id={`Neither Agree Nor Disagree`}
              onChange={onChange}
              checked={checked("Neither Agree Nor Disagree")}
            />
          </div>
          <div class="col">
            <Form.Check
              inline
              name={key}
              type="radio"
              id={`Somewhat Agree`}
              onChange={onChange}
              checked={checked("Somewhat Agree")}
            />
          </div>
          <div class="col">
            <Form.Check
              inline
              name={key}
              type="radio"
              id={`Strongly Agree`}
              onChange={onChange}
              checked={checked("Strongly Agree")}
            />
          </div>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
}

export function shuffle(array, rand = Math.random) {
  console.log("before", [...array]);
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(rand() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  console.log("after", [...array]);
}

// From https://stackoverflow.com/a/47593316
export function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getRandomizedConfigurationOrderForUser(numConfigurations, id) {
  var seed = cyrb53(id);
  var rand = mulberry32(seed);
  var retval = [...Array(numConfigurations).keys()];
  shuffle(retval, rand);
  return retval;
}

// From https://stackoverflow.com/a/52171480
export const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// The completion code is a deterministic function of the id
export function getCompletionCode(id) {
  return cyrb53(id).toString(36);
}

export function msToString(numMs) {
  var ms = numMs % 1000;
  var secs = ((numMs - ms) / 1000) % 60;
  var mins = (numMs - secs * 1000 - ms) / 60;

  return (
    mins.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    ":" +
    secs.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  ); // + ":" + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
}

export function hasMinWords(sentence, minWords = 3, minLengthWords = 2) {
  var words = sentence.split(" ");
  if (words.length < minWords) {
    return false;
  }
  var numWordsOfMinLength = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i].length >= minLengthWords) {
      numWordsOfMinLength++;
    }
  }
  return numWordsOfMinLength >= minWords;
}
