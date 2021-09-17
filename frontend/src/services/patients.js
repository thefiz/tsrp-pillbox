import http from "../http-common"

class PatientDataService {
    getAll(page = 0) {
        return http.get(`/patients/?page=${page}`);
    }

    get(id) {
        return http.get(`/patients/id/${id}`);
    }

    find(query, by = "name", page = 0) {
        return http.get(`/patients/?${by}=${query}&page=${page}`);
    }

    createPatient(data) {
        return http.post("/patients", data)
    }
}

export default new PatientDataService;