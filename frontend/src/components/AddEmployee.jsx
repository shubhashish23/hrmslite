/**
 * AddEmployee
 *
 * Renders a form for creating a new employee record.
 * This component:
 * - Collects employee details (ID, name, email, department)
 * - Submits data to the backend Employee API
 * - Displays server-side validation errors
 * - Redirects to the employee list on successful creation
 *
 * Assumptions:
 * - Employee ID and email must be unique
 * - Department values are predefined on the frontend
 * - No authentication or role-based access is required
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  API  from '../services/api';

function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError((prev) => ({ ...prev, [e.target.name]: {} }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError({});
    try {
      
      await API.post('employees/', formData);
      
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data); 
      } else {
        setError({ general: 'Failed to add employee' });
      }
    }
  };


  return (
    <div className="card">
      <h2>Add New Employee</h2>
      {error.general && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {error.employee_id && (
          <div style={{ color: 'red' }}>{error.employee_id[0]}</div>
        )}
        <div className="form-group">
          <label>Employee ID (Unique)</label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="e.g. EMP001"
            required
          />
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        {error.email && (
          <div style={{ color: 'red' }}>{error.email[0]}</div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
