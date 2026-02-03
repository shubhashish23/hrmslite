# HRMS Lite

## Project Overview
HRMS Lite is a lightweight Human Resource Management System built to manage employee records and track daily attendance.
It is designed as a single-admin system with no authentication, focusing on clean APIs, a professional UI, and real usability.

### Key highlights:
API-first backend using Django REST Framework
React 19 frontend with dashboard visualizations
PostgreSQL persistence
Pagination, filtering, validations, and dashboard analytics

---
 
## Tech Stack Used

### Frontend
- React 19
- JavaScript (ES6+)
- Chart.js and react-chartjs-2
- Axios for API communication

### Backend
- Python
- Django
- Django REST Framework

### Database
- PostgreSQL

### Architecture

-RESTful APIs
-Frontend consumes live backend APIs
-No authentication (single admin assumption)

---

## Steps to Run the Project Locally


### Backend Setup

1. Clone the repository:
   git clone <https://github.com/shubhashish23/hrmslite.git>
   cd backend
   create env
   activate env
   runserver

### Developer Advisory & Code Reference Guide
-Important Note for refernece

This project follows a self-documented code approach.
Please refer to the docstrings defined at the top of each ViewSet, Serializer, and Frontend Component.

#### The docstrings describe:

- Component responsibility
- API behavior
- Assumptions and constraints
- Intended scope (what the code should and should not do)



#### Backend Reference
- ViewSets

-- EmployeeViewSet
Manages employee CRUD operations
Annotates employees with total present days
Handles listing, creation, and deletion of employees

-- AttendanceViewSet
Manages attendance records
Supports date-based and range-based filtering
Prevents duplicate attendance per employee per date

- Serializers

-- EmployeeSerializer
Serializes employee data
Includes derived present_days field (read-only)
Enforces uniqueness for employee ID and email

-- AttendanceSerializer
Serializes attendance records
Exposes employee name and code as read-only fields
Prevents duplicate attendance entries using composite validation
Refer to serializer docstrings for validation rules and field behavior.

#### Frontend Component Reference

- EmployeeList
Displays paginated list of employees
Supports deletion and navigation to add employee form
Shows total present days per employee

- AddEmployee
Handles creation of new employee records
Displays server-side validation errors
Redirects to employee list on success

- Attendance
Handles attendance marking
Displays attendance history with pagination
Supports date-based filtering

- Dashboard
Displays attendance analytics and summaries
Shows date-wise and department-wise attendance insights
Computes derived metrics on the client side

Each component contains a top-level docstring describing its role and assumptions.

