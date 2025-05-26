const express = require('express');
const router = express.Router();

const {
        authenticateToken,
        authorizeRoles 
      } = require('../middleware/auth');

const { 
        loginUser,
        registerUser,
      } = require('../controllers/authController');

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






router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/employees',authenticateToken, authorizeRoles('employee'),  getAllEmployees);
router.get('/employees/:id',authenticateToken, authorizeRoles('admin'),  getEmployeeById);
router.post('/employees',authenticateToken, authorizeRoles('admin'),  createEmployee);
router.put('/employees/:id',authenticateToken, authorizeRoles('admin'),  updateEmployee);
router.delete('/employees/:id',authenticateToken, authorizeRoles('admin'),  deleteEmployee);
router.put('/employees/:id/password',authenticateToken, authorizeRoles('admin'),  changePassword);
router.get('/stats/employees',authenticateToken, authorizeRoles('admin'),  getEmployeeStats); // total employees
router.get('/stats/employees-by-department',authenticateToken, authorizeRoles('admin'),  getDepartmentStats); // employees per department

module.exports = router;
