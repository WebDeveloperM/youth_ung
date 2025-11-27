from django.utils.deprecation import MiddlewareMixin
from .models import Visitor, PageView
from django.utils import timezone
import re


class AnalyticsMiddleware(MiddlewareMixin):
    """Middleware для автоматического отслеживания посещений"""
    
    # Пути, которые не нужно отслеживать
    EXCLUDED_PATHS = [
        r'^/admin/jsi18n/',
        r'^/static/',
        r'^/media/',
        r'^/uploads/',
        r'\.ico$',
        r'\.png$',
        r'\.jpg$',
        r'\.css$',
        r'\.js$',
    ]
    
    def process_request(self, request):
        """Обрабатываем запрос и логируем посещение"""
        # Проверяем, нужно ли отслеживать этот путь
        path = request.path
        for pattern in self.EXCLUDED_PATHS:
            if re.search(pattern, path):
                return None
        
        # Получаем информацию о посетителе
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        session_key = request.session.session_key if hasattr(request, 'session') else None
        user = request.user if request.user.is_authenticated else None
        
        # Парсим user agent для определения браузера, ОС и устройства
        browser, os, device = self.parse_user_agent(user_agent)
        
        # Получаем или создаем посетителя
        visitor, created = Visitor.objects.get_or_create(
            ip_address=ip_address,
            session_key=session_key,
            defaults={
                'user': user,
                'user_agent': user_agent,
                'browser': browser,
                'os': os,
                'device': device,
            }
        )
        
        if not created:
            # Обновляем информацию о посетителе
            visitor.visit_count += 1
            visitor.last_visit = timezone.now()
            if user and not visitor.user:
                visitor.user = user
            visitor.save(update_fields=['visit_count', 'last_visit', 'user'])
        
        # Создаем запись о просмотре страницы
        referer = request.META.get('HTTP_REFERER', '')
        PageView.objects.create(
            visitor=visitor,
            url=request.build_absolute_uri(),
            path=path,
            method=request.method,
            referer=referer,
        )
        
        # Сохраняем ID посетителя в request для дальнейшего использования
        request.visitor = visitor
        
        return None
    
    def process_response(self, request, response):
        """Обновляем статус код ответа"""
        if hasattr(request, 'visitor'):
            # Обновляем последний просмотр с кодом ответа
            try:
                last_view = PageView.objects.filter(visitor=request.visitor).latest('timestamp')
                last_view.status_code = response.status_code
                last_view.save(update_fields=['status_code'])
            except PageView.DoesNotExist:
                pass
        
        return response
    
    @staticmethod
    def get_client_ip(request):
        """Получаем реальный IP адрес клиента"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
        return ip
    
    @staticmethod
    def parse_user_agent(user_agent):
        """Простой парсинг user agent"""
        browser = 'Unknown'
        os = 'Unknown'
        device = 'desktop'
        
        if not user_agent:
            return browser, os, device
        
        user_agent_lower = user_agent.lower()
        
        # Определяем браузер
        if 'chrome' in user_agent_lower and 'edg' not in user_agent_lower:
            browser = 'Chrome'
        elif 'safari' in user_agent_lower and 'chrome' not in user_agent_lower:
            browser = 'Safari'
        elif 'firefox' in user_agent_lower:
            browser = 'Firefox'
        elif 'edg' in user_agent_lower:
            browser = 'Edge'
        elif 'opera' in user_agent_lower or 'opr' in user_agent_lower:
            browser = 'Opera'
        elif 'msie' in user_agent_lower or 'trident' in user_agent_lower:
            browser = 'Internet Explorer'
        
        # Определяем ОС
        if 'windows' in user_agent_lower:
            os = 'Windows'
        elif 'mac' in user_agent_lower or 'darwin' in user_agent_lower:
            os = 'macOS'
        elif 'linux' in user_agent_lower:
            os = 'Linux'
        elif 'android' in user_agent_lower:
            os = 'Android'
        elif 'iphone' in user_agent_lower or 'ipad' in user_agent_lower:
            os = 'iOS'
        
        # Определяем устройство
        if 'mobile' in user_agent_lower or 'android' in user_agent_lower or 'iphone' in user_agent_lower:
            device = 'mobile'
        elif 'tablet' in user_agent_lower or 'ipad' in user_agent_lower:
            device = 'tablet'
        else:
            device = 'desktop'
        
        return browser, os, device



