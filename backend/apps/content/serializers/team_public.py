from rest_framework import serializers
from content.models import TeamMember


class TeamMemberPublicSerializer(serializers.ModelSerializer):
    """Сериализатор для членов команды (публичный API)"""
    
    class Meta:
        model = TeamMember
        fields = [
            'id',
            'name_uz', 'name_ru', 'name_en',
            'position_uz', 'position_ru', 'position_en',
            'bio_uz', 'bio_ru', 'bio_en',
            'photo',
            'email',
            'phone',
            'linkedin',
            'telegram',
            'order',
            'is_active',
        ]

