from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count
from analytics.models import Visitor, PageView, DailyStats
from content.models import News, Grant, Scholarship, Competition, Innovation, Internship, Job


class Command(BaseCommand):
    help = 'Генерация ежедневной статистики'

    def add_arguments(self, parser):
        parser.add_argument(
            '--date',
            type=str,
            help='Дата в формате YYYY-MM-DD (по умолчанию - вчера)',
        )

    def handle(self, *args, **options):
        # Определяем дату для генерации статистики
        if options['date']:
            from datetime import datetime
            date = datetime.strptime(options['date'], '%Y-%m-%d').date()
        else:
            # По умолчанию генерируем статистику за вчера
            date = (timezone.now() - timedelta(days=1)).date()
        
        self.stdout.write(f'Генерация статистики за {date}...')
        
        # Статистика посетителей
        total_visitors = Visitor.objects.filter(last_visit__date=date).count()
        
        # Уникальные посетители за день
        unique_visitors = Visitor.objects.filter(
            page_views__timestamp__date=date
        ).distinct().count()
        
        # Новые посетители (первый визит в этот день)
        new_visitors = Visitor.objects.filter(first_visit__date=date).count()
        
        # Возвращающиеся посетители
        returning_visitors = unique_visitors - new_visitors
        
        # Статистика просмотров
        total_pageviews = PageView.objects.filter(timestamp__date=date).count()
        
        # Среднее страниц на посетителя
        avg_pages_per_visitor = total_pageviews / unique_visitors if unique_visitors > 0 else 0
        
        # Среднее время на сайте (в минутах)
        avg_time_seconds = PageView.objects.filter(
            timestamp__date=date,
            time_spent__isnull=False
        ).aggregate(avg=Sum('time_spent'))['avg'] or 0
        avg_time_on_site = avg_time_seconds / 60 if avg_time_seconds else 0
        
        # Показатель отказов (посетители с только одним просмотром)
        single_page_visitors = Visitor.objects.filter(
            page_views__timestamp__date=date
        ).annotate(
            page_count=Count('page_views')
        ).filter(page_count=1).count()
        bounce_rate = (single_page_visitors / unique_visitors * 100) if unique_visitors > 0 else 0
        
        # Статистика публикаций
        news_published = News.objects.filter(date=date).count()
        grants_published = Grant.objects.filter(created_at__date=date).count()
        scholarships_published = Scholarship.objects.filter(created_at__date=date).count()
        competitions_published = Competition.objects.filter(created_at__date=date).count()
        innovations_published = Innovation.objects.filter(created_at__date=date).count()
        internships_published = Internship.objects.filter(created_at__date=date).count()
        jobs_published = Job.objects.filter(created_at__date=date).count()
        
        # Статистика по устройствам
        mobile_visitors = Visitor.objects.filter(
            last_visit__date=date,
            device='mobile'
        ).count()
        tablet_visitors = Visitor.objects.filter(
            last_visit__date=date,
            device='tablet'
        ).count()
        desktop_visitors = Visitor.objects.filter(
            last_visit__date=date,
            device='desktop'
        ).count()
        
        # Создаем или обновляем запись статистики
        stats, created = DailyStats.objects.update_or_create(
            date=date,
            defaults={
                'total_visitors': total_visitors,
                'unique_visitors': unique_visitors,
                'new_visitors': new_visitors,
                'returning_visitors': returning_visitors,
                'total_pageviews': total_pageviews,
                'avg_pages_per_visitor': avg_pages_per_visitor,
                'avg_time_on_site': avg_time_on_site,
                'bounce_rate': bounce_rate,
                'news_published': news_published,
                'grants_published': grants_published,
                'scholarships_published': scholarships_published,
                'competitions_published': competitions_published,
                'innovations_published': innovations_published,
                'internships_published': internships_published,
                'jobs_published': jobs_published,
                'mobile_visitors': mobile_visitors,
                'tablet_visitors': tablet_visitors,
                'desktop_visitors': desktop_visitors,
            }
        )
        
        action = 'создана' if created else 'обновлена'
        self.stdout.write(
            self.style.SUCCESS(f'Статистика за {date} успешно {action}!')
        )
        self.stdout.write(
            f'  Уникальных посетителей: {unique_visitors}'
        )
        self.stdout.write(
            f'  Всего просмотров: {total_pageviews}'
        )
        self.stdout.write(
            f'  Публикаций: {news_published + grants_published + scholarships_published + competitions_published + innovations_published + internships_published + jobs_published}'
        )

