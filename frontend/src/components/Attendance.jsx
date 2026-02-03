/**
 * Attendance
 *
 * Manages employee attendance operations, including:
 * - Marking daily attendance for an employee
 * - Displaying attendance history in a paginated table
 * - Filtering attendance records by date
 *
 * This component:
 * - Fetches employee data for attendance selection
 * - Submits attendance records to the backend API
 * - Handles server-side validation errors and duplicate entries
 *
 * Assumptions:
 * - Attendance can be marked only once per employee per date
 * - Attendance status is either "Present" or "Absent"
 * - Backend APIs return paginated responses
 */


import { useEffect, useState } from 'react';
import API from '../services/api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    employee: '', 
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [message, setMessage] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => {
    fetchEmployees();
    fetchRecords(); 
  }, []);

  
  const fetchEmployees = async () => {
    try {
      const res = await API.get('employees/');
      setEmployees(res.data.results ?? res.data);
    } catch (err) {
      console.error('Error fetching employees', err);
    }
  };

  // Handle form changes
  const handleEmployeeChange = (e) => {
    setFormData({ ...formData, employee: e.target.value });
    setError((prev) => ({ ...prev, non_field_errors: null }));
  };
  const handleDateChange = (e) => {
    setFormData({ ...formData, date: e.target.value });
    setError((prev) => ({ ...prev, non_field_errors: null }));
  };

  
  const fetchRecords = async (pageUrl = null) => {
    try {
      
      const url =
        pageUrl || `attendance/${filterDate ? `?date=${filterDate}` : ''}`;

      const res = await API.get(url);
      setRecords(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      console.error(err);
      setRecords([]); 
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('attendance/', formData);
      setMessage('Attendance marked successfully');
      setError({});

      
      if (filterDate) {
        fetchRecords();
      } else {
        fetchRecords(); 
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError({ general: 'Failed to mark attendance' });
      }
    }
  };

  return (
    <div className="container">
      {/* Attendance Form */}
      <div className="card">
        <h2>Mark Attendance</h2>

        {error.non_field_errors && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error.non_field_errors[0]}
          </div>
        )}
        {error.general && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error.general}
          </div>
        )}
        {message && (
          <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Employee</label>
            <select
              value={formData.employee}
              onChange={handleEmployeeChange}
              required
            >
              <option value="">-- Select --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="attendance-header">
          <h2>Attendance History</h2>

          <div className="filter-bar">
            <div className="filter-group">
              <label htmlFor="filterDate">Filter by Date:</label>
              <input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={() => fetchRecords()}>
              Apply
            </button>
          </div>
        </div>

        {records.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'red', marginTop: '1rem' }}>
            Attendance not found
          </p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Employee ID</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.date}</td>
                    <td
                      style={{
                        color: rec.status === 'Absent' ? 'red' : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {rec.status}
                    </td>
                    <td>
                      {rec.employee_name} ({rec.employee_code})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={!prevPage}
                onClick={() => prevPage && fetchRecords(prevPage)}
              >
                Prev
              </button>
              <button
                disabled={!nextPage}
                onClick={() => nextPage && fetchRecords(nextPage)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;
