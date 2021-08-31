import express from "express"
import StaffCtrl from "./staff.controller.js"

const router = express.Router()

router.route("/").get(StaffCtrl.apiGetStaff)

export default router