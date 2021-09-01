import express from "express";
import cors from "cors";
import staff from "./api/staff.route.js";
import patients from "./api/patients.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/staff", staff)
app.use("/api/v1/patients", patients)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app