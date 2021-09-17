import React, { useState, useEffect } from "react";
import PatientsDataService from "../services/patients";
import { Link } from "react-router-dom";

const Patient = props => {
  const initialPatientState = {
    id: null,
    name: "",
    phone: "",
    dob: "",
    blood: "",
    emergency_contact: {},
    notes: "",
    visits: [],
    appointments: [],
    location: [],
    prescriptions: []
  };
  const [patient, setPatient] = useState(initialPatientState)

  const getPatient = id => {
    PatientsDataService.get(id)
    .then(response => {
      setPatient(response.data)
      console.log(Patient.visits)
    })
    .catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    getPatient(props.match.params.id)
  }, [props.match.params.id])

  return (
    <div>
      <Link to={"/patients/"}><strong>Back to list.</strong></Link>
      {patient ? (
        <div>
          <h5>{patient.name}</h5>
          <p>
            <strong>Date of Birth: </strong>{patient.dob.split('T')[0]}<br/>
            <strong>Phone Number: </strong>{patient.phone}<br/>
            <strong>Blood Type: </strong>{patient.blood}<br/>
            <strong>Emergency Contact: </strong>{patient.emergency_contact.name + " - " + patient.emergency_contact.phone}<br/>
            <strong>Notes: </strong>{patient.notes}<br/>
            <h4> Visits </h4>
            {patient.visits.length > 0 ? (
              patient.visits.map((visit, index) => {
                return (
                  <div>
                  <strong>Reason: </strong>{visit.reason}<br/>
                  </div>
                )
              })
            ) : (<p>No Visits</p>)}
          </p>
        </div>
      ) : (
        <div>
          <br />
          <p>No Patient Selected.</p>
        </div>
      )}
    </div>
  )
}

export default Patient