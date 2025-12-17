from rest_framework import serializers
from content.models import Article
from users.models import User


class ArticleAdminListSerializer(serializers.ModelSerializer):
    """Admin panel uchun maqolalar ro'yxati"""
    author_name = serializers.SerializerMethodField()
    author_email = serializers.EmailField(source='author.email', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title_uz', 'title_ru', 'title_en',
            'author', 'author_name', 'author_email',
            'category', 'status', 'is_published', 'is_featured',
            'views', 'downloads', 'likes', 'created_at', 'updated_at'
        ]
    
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author.first_name else obj.author.username


class ArticleAdminDetailSerializer(serializers.ModelSerializer):
    """Admin panel uchun maqola tafsilotlari"""
    author_details = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = '__all__'
    
    def get_author_details(self, obj):
        return {
            'id': obj.author.id,
            'username': obj.author.username,
            'email': obj.author.email,
            'first_name': obj.author.first_name,
            'last_name': obj.author.last_name,
            'avatar': obj.author.avatar.url if obj.author.avatar else None
        }
    
    def get_approved_by_name(self, obj):
        if obj.approved_by:
            return f"{obj.approved_by.first_name} {obj.approved_by.last_name}" if obj.approved_by.first_name else obj.approved_by.username
        return None


class ArticleApprovalSerializer(serializers.ModelSerializer):
    """Maqolani tasdiqlash/rad etish uchun serializer"""
    
    class Meta:
        model = Article
        fields = ['status', 'admin_comment', 'is_published', 'is_featured']
    
    def validate_status(self, value):
        if value not in ['approved', 'rejected', 'revision', 'pending']:
            raise serializers.ValidationError("Noto'g'ri status qiymati")
        return value
    
    def update(self, instance, validated_data):
        from django.utils import timezone
        
        if validated_data.get('status') == 'approved':
            instance.approved_by = self.context['request'].user
            instance.approved_at = timezone.now()
            if 'is_published' not in validated_data:
                validated_data['is_published'] = True
        
        return super().update(instance, validated_data)

