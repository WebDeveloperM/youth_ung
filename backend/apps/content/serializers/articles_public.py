from rest_framework import serializers
from content.models import Article
from users.models import User


class ArticleAuthorSerializer(serializers.ModelSerializer):
    """Maqola muallifi uchun serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar']


class ArticleListSerializer(serializers.ModelSerializer):
    """Maqolalar ro'yxati uchun serializer"""
    author = ArticleAuthorSerializer(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title_uz', 'title_ru', 'title_en',
            'abstract_uz', 'abstract_ru', 'abstract_en',
            'cover_image', 'category', 'author',
            'publication_date', 'views', 'downloads', 'likes',
            'is_featured', 'created_at', 'keywords_uz', 'keywords_ru', 'keywords_en'
        ]


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Maqola tafsilotlari uchun serializer"""
    author = ArticleAuthorSerializer(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'author', 'title_uz', 'title_ru', 'title_en',
            'abstract_uz', 'abstract_ru', 'abstract_en',
            'content_uz', 'content_ru', 'content_en',
            'pdf_file', 'cover_image', 'category',
            'keywords_uz', 'keywords_ru', 'keywords_en',
            'doi', 'publication_date', 'views', 'downloads', 'likes',
            'is_featured', 'created_at', 'updated_at'
        ]
    
    def update(self, instance, validated_data):
        """Ko'rishlar sonini oshirish"""
        if 'views' in validated_data:
            instance.views = validated_data.pop('views')
        return super().update(instance, validated_data)


class ArticleSubmitSerializer(serializers.ModelSerializer):
    """Foydalanuvchi tomonidan maqola yuborish uchun serializer"""
    
    class Meta:
        model = Article
        fields = [
            'title_uz', 'title_ru', 'title_en',
            'abstract_uz', 'abstract_ru', 'abstract_en',
            'content_uz', 'content_ru', 'content_en',
            'pdf_file', 'cover_image', 'category',
            'keywords_uz', 'keywords_ru', 'keywords_en',
            'doi', 'publication_date'
        ]
    
    def create(self, validated_data):
        """Yangi maqola yaratish (pending holatda)"""
        validated_data['status'] = 'pending'
        validated_data['is_published'] = False
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class MyArticleSerializer(serializers.ModelSerializer):
    """Foydalanuvchining o'z maqolalari uchun serializer"""
    
    class Meta:
        model = Article
        fields = [
            'id', 'title_uz', 'title_ru', 'title_en',
            'abstract_uz', 'abstract_ru', 'abstract_en',
            'cover_image', 'category', 'status', 
            'admin_comment', 'is_published',
            'created_at', 'updated_at', 'views', 'downloads', 'likes'
        ]
        read_only_fields = ['status', 'admin_comment', 'is_published', 'views', 'downloads', 'likes']

