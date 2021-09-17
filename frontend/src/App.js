import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPatients from "./components/add-patient";
import ListPatients from "./components/patients-list";
import Patients from "./components/patients";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
          TSRP Medical Records
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/patients"} className="nav-link">
              Patients
            </Link>
          </li>
        </div>
      </nav>

      <div classname="container mt-3">
        <Switch>
          <Route exact path={("/", "/patients")} component={ListPatients} />
          <Route
            path="/patients/:id"
            render={(props) => <Patients {...props} />}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
