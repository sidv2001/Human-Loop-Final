import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  NotFound,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Records from "./config.json";
import StudyPage from "./StudyPage";
import arrayShuffle from "array-shuffle";
import Instructions from "./Instructions";
import { ExitSurveyDemographic } from "./ExitSurveyDemographic";
import { CompletionCode } from "./CompletionCode";
import { shuffle, mulberry32, cyrb53 } from "./helpers";
import { FinalSurvey } from "./FinalSurvey";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        key={parseInt(params.study_part_i)}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

//const SERVER_URL = "http://0.0.0.0:8194/";
const SERVER_URL = "http://ec2-54-209-65-119.compute-1.amazonaws.com:8194/";

function generateUserId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function generateRandomOrdering(id) {
  var seed = cyrb53(id);
  var rand = mulberry32(seed);
  const order = [0, 1];
  var remaining_condition = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  shuffle(remaining_condition, rand);
  const final_order = order.concat(remaining_condition);
  console.log("Final", final_order);
  return final_order;
}

const ordering = generateRandomOrdering;

function App() {
  var config = Records;
  var StudyPageWithRouter = withRouter(StudyPage);
  var InstructionsWithRouter = withRouter(Instructions);
  var ExitSurveyDemographicWithRouter = withRouter(ExitSurveyDemographic);
  var FinalSurveyWithRouter = withRouter(FinalSurvey);

  return (
    <div className="App">
      <Router>
        <div>
          {/*
            A <Routes> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Routes> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Routes>
            <Route
              exact={true}
              path="/"
              element={<Navigate to={`/${generateUserId()}/instructions`} />}
            />
            <Route
              path="/:id/instructions"
              element={<InstructionsWithRouter />}
            />
            <Route
              exact={true}
              path={`/:id/study/:study_part_i`}
              element={
                <StudyPageWithRouter
                  server_url={SERVER_URL}
                  config={config}
                  ordering={ordering}
                />
              }
            />
            <Route
              exact={true}
              path={`/:id/demographic`}
              element={
                <ExitSurveyDemographicWithRouter server_url={SERVER_URL} />
              }
            />
            <Route
              exact={true}
              path={`/:id/final_survey`}
              element={<FinalSurveyWithRouter server_url={SERVER_URL} />}
            />
            <Route
              exact={true}
              path={`/:id/completionCode`}
              element={<CompletionCode />}
            />
            {/* <Route
              exact={true}
              path={`/:id/completionCode`}
              element={<CompletionCode />}
            /> */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
