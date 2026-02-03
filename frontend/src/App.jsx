import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './styles.css';

import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import Attendance from './components/Attendance';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <div className="navbar">
        <div><span className="font-size-header">HRMS</span> <i>lite</i></div>
        <div>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/employees" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Employees</NavLink>
          {/* <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Employee</NavLink> */}
          <NavLink to="/attendance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Attendance</NavLink>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Developed by <strong>Shubhashish Tiwari</strong>
      </footer>
    </Router>
  );
}

export default App;
