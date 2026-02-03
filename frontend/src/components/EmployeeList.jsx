/**
 * EmployeeList
 *
 * Displays a paginated list of employees fetched from the backend.
 * This component allows the admin to:
 * - View employee details
 * - See total present days per employee
 * - Delete an employee record
 * - Navigate to the Add Employee form
 *
 * Responsibilities:
 * - Fetch employee data from the Employee API
 * - Handle loading and error states
 * - Manage pagination using backend-provided links
 *
 * Assumptions:
 * - Backend API responses are paginated
 * - Deleting an employee removes all associated records
 * - No authentication or role-based access is required
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API  from '../services/api';

function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (url = 'employees/') => {
    try {
      const response = await API.get(url);
      setEmployees(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      try {
        await API.delete(`employees/${id}/`);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Employee List</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/add')}
        >
          + Add Employee
        </button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Present Days</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employee_id}</td>
                <td>{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.present_days}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={!prevPage}
          onClick={() => fetchEmployees(prevPage.replace(API.defaults.baseURL, ''))}
        >
          Prev
        </button>

        <button
          disabled={!nextPage}
          onClick={() => fetchEmployees(nextPage.replace(API.defaults.baseURL, ''))}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default EmployeeList;
