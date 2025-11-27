from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Visitor, PageView, ContentStatistics, UserActivity, DailyStats
from content.models import News, Grant, Scholarship, Competition, Innovation, Internship, Job


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ('id', 'ip_address', 'user', 'browser', 'os', 'device', 
                   'visit_count', 'first_visit', 'last_visit')
    list_filter = ('device', 'browser', 'os', 'first_visit', 'last_visit')
    search_fields = ('ip_address', 'user__username', 'user__email', 'city', 'country')
    readonly_fields = ('first_visit', 'last_visit', 'visit_count')
    date_hierarchy = 'last_visit'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('ip_address', 'user', 'session_key')
        }),
        ('Технические данные', {
            'fields': ('user_agent', 'browser', 'os', 'device')
        }),
        ('Геолокация', {
            'fields': ('country', 'city'),
            'classes': ('collapse',)
        }),
        ('Статистика', {
            'fields': ('visit_count', 'first_visit', 'last_visit')
        }),
    )


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('id', 'visitor_link', 'path', 'method', 'status_code', 
                   'timestamp', 'time_spent')
    list_filter = ('method', 'status_code', 'timestamp')
    search_fields = ('path', 'url', 'visitor__ip_address', 'visitor__user__username')
    readonly_fields = ('visitor', 'timestamp')
    date_hierarchy = 'timestamp'
    
    def visitor_link(self, obj):
        return str(obj.visitor)
    visitor_link.short_description = 'Посетитель'


@admin.register(ContentStatistics)
class ContentStatisticsAdmin(admin.ModelAdmin):
    list_display = ('id', 'content_type', 'object_id', 'date', 
                   'views_count', 'unique_visitors', 'likes_count')
    list_filter = ('content_type', 'date')
    date_hierarchy = 'date'
    readonly_fields = ('content_type', 'object_id', 'date')


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'action', 'content_type', 'object_id', 
                   'timestamp', 'ip_address')
    list_filter = ('action', 'timestamp', 'user')
    search_fields = ('user__username', 'description', 'ip_address')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'


@admin.register(DailyStats)
class DailyStatsAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_visitors', 'unique_visitors', 'total_pageviews',
                   'news_published', 'grants_published', 'jobs_published')
    list_filter = ('date',)
    date_hierarchy = 'date'
    readonly_fields = ('date',)


# Analytics views are handled in views.py

