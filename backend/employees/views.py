from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from django.db.models import Count, Q

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing employee records.

    Provides CRUD operations for employees, including:
    - Creating a new employee
    - Retrieving a list of employees (paginated)
    - Deleting an employee

    The queryset annotates each employee with `present_days`,
    representing the total number of days the employee was marked
    as Present in attendance records.

    Employees are ordered alphabetically by full name.
   
    """
    queryset = Employee.objects.annotate(
        present_days=Count('attendance', filter=Q(attendance__status='Present'))
    ).order_by('full_name')
    serializer_class = EmployeeSerializer