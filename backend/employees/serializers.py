from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model.

    Serializes all employee fields and includes a read-only
    `present_days` field that represents the total number of
    days the employee was marked as Present.

    Enforces uniqueness on:
    - employee_id
    - email
    """
    present_days = serializers.IntegerField(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'
        extra_kwargs = {
            'employee_id': {
                'error_messages': {
                    'unique': 'Employee ID already exists.'
                }
            },
            'email': {
                'error_messages': {
                    'unique': 'Email already exists.'
                }
            }
        }
