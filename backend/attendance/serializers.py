from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model.

    Includes employee-related read-only fields for convenience:
    - employee_name: Full name of the employee
    - employee_code: Employee ID

    Enforces a unique constraint to prevent marking attendance
    more than once for the same employee on the same date.
    """
    employee_name = serializers.CharField(
        source='employee.full_name', read_only=True
    )
    employee_code = serializers.CharField(
        source='employee.employee_id', read_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee',        
            'employee_code',   
            'employee_name',  
            'date',
            'status',
        ]
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Attendance.objects.all(),
                fields=['employee', 'date'],
                message='Attendance already marked for this employee on this date.'
            )
        ]