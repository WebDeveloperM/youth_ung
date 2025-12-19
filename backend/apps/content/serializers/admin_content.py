from rest_framework import serializers
from content.models import (
    Grant, Scholarship, Competition, Innovation,
    Internship, Job, TeamMember,
    Technology, Project, Research, Result,
)


# ГРАНТЫ
class GrantAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grant
        fields = '__all__'
        read_only_fields = ['id', 'applicants', 'created_at', 'updated_at', 'created_by', 'updated_by']


# СТИПЕНДИИ
class ScholarshipAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = '__all__'
        read_only_fields = ['id', 'recipients', 'created_at', 'updated_at', 'created_by', 'updated_by']


# КОНКУРСЫ
class CompetitionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'
        read_only_fields = ['id', 'participants', 'created_at', 'updated_at', 'created_by', 'updated_by']


# ИННОВАЦИИ
class InnovationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Innovation
        fields = '__all__'
        read_only_fields = ['id', 'likes', 'views', 'created_at', 'updated_at', 'created_by', 'updated_by']


# СТАЖИРОВКИ
class InternshipAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ['id', 'applicants', 'created_at', 'updated_at', 'created_by', 'updated_by']


# ВАКАНСИИ
class JobAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'applicants', 'created_at', 'updated_at', 'created_by', 'updated_by']


# КОМАНДА
class TeamMemberAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


# ТЕХНОЛОГИИ
class TechnologyAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = '__all__'
        read_only_fields = ['id', 'views', 'likes', 'created_at', 'updated_at', 'created_by', 'updated_by']


# ПРОЕКТЫ
class ProjectAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['id', 'views', 'likes', 'created_at', 'updated_at', 'created_by', 'updated_by']


# ИССЛЕДОВАНИЯ
class ResearchAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research
        fields = '__all__'
        read_only_fields = ['id', 'views', 'likes', 'created_at', 'updated_at', 'created_by', 'updated_by']


# РЕЗУЛЬТАТЫ
class ResultAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
        read_only_fields = ['id', 'views', 'likes', 'created_at', 'updated_at', 'created_by', 'updated_by']


