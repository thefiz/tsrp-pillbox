import React, { useState, useEffect } from "react";
import PatientsDataService from "../services/patients";
import { Link } from "react-router-dom";

const ListPatients = (props) => {
  const [patients, setPatients] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    retrievePatients();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const retrievePatients = () => {
    PatientsDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setPatients(response.data.patients);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrievePatients();
  };

  const findByName = () => {
    find(searchName, "name");
  };

  const find = (query, by) => {
    PatientsDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setPatients(response.data.patients);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {patients.map((patients) => {
          return (
              <Link to={"/patients/" + patients._id}>{patients.name}</Link>
            // <div className="col-lg-4 pb-1">
            //   <div className="card">
            //     <div className="card-body">
            //       <h5 className="card-title">{patients.name}</h5>
            //       <p className="card-text">
            //         <strong>Date of Birth: </strong>
            //         {patients.dob}
            //         <br />
            //       </p>
            //       <div className="row">
            //         <Link
            //           to={"/patients/" + patients._id}
            //           className="btn btn-primary col-lg-5 mx-1 mb-1"
            //         >
            //           View Details
            //         </Link>
            //       </div>
            //     </div>
            //   </div>
            // </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListPatients;
