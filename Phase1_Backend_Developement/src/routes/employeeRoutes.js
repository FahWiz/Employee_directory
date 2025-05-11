const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  changePassword,
  getEmployeeStats,
  getDepartmentStats
} = require('../controllers/employeeController');

router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);
router.put('/employees/:id/password', changePassword);
router.get('/stats/employees', getEmployeeStats); // total employees
router.get('/stats/employees-by-department', getDepartmentStats); // employees per department

module.exports = router;
