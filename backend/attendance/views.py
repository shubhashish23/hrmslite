from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceViewSet(viewsets.ModelViewSet):

    """
    ViewSet for managing employee attendance records.

    Supports:
    - Marking attendance for an employee
    - Retrieving attendance records (paginated)
    - Filtering attendance by:
        - Specific date (?date=YYYY-MM-DD)
        - Date range (?from=YYYY-MM-DD&to=YYYY-MM-DD)

    Attendance records are ordered by date in descending order
    (latest records first).
    """
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        """
        Optionally filters attendance records based on query parameters.

        Query Parameters:
        - date: Filter attendance for a specific date
        - from: Start date for date range filtering
        - to: End date for date range filtering

        Returns:
        - Filtered queryset ordered by date (descending)
        """
        queryset = Attendance.objects.all().order_by('-date')

        date = self.request.query_params.get('date')
        from_date = self.request.query_params.get('from')
        to_date = self.request.query_params.get('to')

        if date:
            queryset = queryset.filter(date=date)

        if from_date and to_date:
            queryset = queryset.filter(date__range=[from_date, to_date])

        return queryset