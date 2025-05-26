const db=require('../db/index');


const getAllEmployees = async (req, res) => {
  const requesterRole = req.user.role;

  try {
    let query;

    if (requesterRole === 'admin') {
      // Admin sees all columns
      query = 'SELECT * FROM employees';
    } else if (requesterRole === 'employee') {
      // Employee sees limited info only
      query = `
        SELECT id, first_name, last_name, email, department_id, bio profile_pic_url, join_date, status
        FROM employees
      `;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get employee by ID

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Employee not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Create a new employee
const createEmployee = async (req, res) => {
    const { first_name, last_name,email,phone=null,department_id,bio=null,profile_pic_url=null,join_date,address=null,date_of_birth=null,gender=null,employment_type,salary=null} = req.body;
    
    if (!first_name || !last_name || !email || !department_id || !join_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const result = await db.query(
        `INSERT INTO employees ( first_name, last_name,email,phone,department_id,bio,profile_pic_url,join_date,address,date_of_birth,gender,employment_type,salary)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13) RETURNING *`,
         [first_name, last_name,email,phone,department_id,bio,profile_pic_url,join_date,address,date_of_birth,gender,employment_type,salary]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Update employee details
 const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;       // from your authenticateToken middleware
  const userRole = req.user.role;   // from your authenticateToken middleware

  // Only admin or the employee themselves can update
  if (userRole !== 'admin' && userId != id) {
    return res.status(403).json({ error: 'You can only update your own profile' });
  }

  const allowedFields = ['email', 'phone', 'bio', 'profile_pic_url'];
  const updates = [];
  const values = [];

  allowedFields.forEach(() => {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${values.length + 1}`);
      values.push(req.body[field]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  values.push(id);

  try {
    const result = await db.query(
      `UPDATE employees SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Employee not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  


 
  // Delete employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Employee not found' });
      res.json({ message: 'Employee deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Get logged-in user info from middleware (assumed you have req.user)
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  // Only admin or user themselves can change password
  if (requesterRole !== 'admin' && requesterId != id) {
    return res.status(403).json({ message: 'You can only change your own password' });
  }

  try {
    const userRes = await db.query('SELECT password_hash FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRes.rows[0];

    // If not admin, verify current password
    if (requesterRole !== 'admin') {
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current password' });
      }
    }

    // Hash new password before storing
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedNewPassword, id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  // Stats: Total number of employees
const getEmployeeStats = async (req, res) => {
    try {
      const result = await db.query('SELECT COUNT(*) FROM employees');
      res.json({ totalEmployees: parseInt(result.rows[0].count) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Stats: Employees per department
const getDepartmentStats = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT departments.id, departments.name, COUNT(employees.id) AS employee_cnt
       FROM departments
       LEFT JOIN employees ON employees.department_id = departments.id
       GROUP BY departments.id, departments.name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



  module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    changePassword,
    getEmployeeStats,
    getDepartmentStats,
  };