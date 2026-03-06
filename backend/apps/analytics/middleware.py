import logging
import re

from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin

from .models import PageView, Visitor

logger = logging.getLogger(__name__)


class AnalyticsMiddleware(MiddlewareMixin):
    """Middleware for automatic visit tracking."""

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
        """Track visit — wrapped in try/except so analytics never crashes the app."""
        try:
            path = request.path
            for pattern in self.EXCLUDED_PATHS:
                if re.search(pattern, path):
                    return None

            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            session_key = request.session.session_key if hasattr(request, 'session') else None
            user = request.user if request.user.is_authenticated else None

            browser, os_name, device = self.parse_user_agent(user_agent)

            # Use filter().first() instead of get_or_create to avoid MultipleObjectsReturned
            # which occurs when multiple gunicorn workers race to create the same Visitor.
            visitor = Visitor.objects.filter(
                ip_address=ip_address,
                session_key=session_key,
            ).first()

            if visitor is None:
                try:
                    visitor = Visitor.objects.create(
                        ip_address=ip_address,
                        session_key=session_key,
                        user=user,
                        user_agent=user_agent,
                        browser=browser,
                        os=os_name,
                        device=device,
                    )
                except Exception:
                    # Race condition: another worker just created it — fetch it
                    visitor = Visitor.objects.filter(
                        ip_address=ip_address,
                        session_key=session_key,
                    ).first()
                    if visitor is None:
                        return None
            else:
                visitor.visit_count += 1
                visitor.last_visit = timezone.now()
                if user and not visitor.user:
                    visitor.user = user
                visitor.save(update_fields=['visit_count', 'last_visit', 'user'])

            referer = request.META.get('HTTP_REFERER', '')
            PageView.objects.create(
                visitor=visitor,
                url=request.build_absolute_uri(),
                path=path,
                method=request.method,
                referer=referer,
            )

            request.visitor = visitor

        except Exception as e:
            logger.warning("Analytics middleware error (non-fatal): %s", e)

        return None

    def process_response(self, request, response):
        """Update response status code in analytics."""
        if hasattr(request, 'visitor'):
            try:
                last_view = PageView.objects.filter(
                    visitor=request.visitor
                ).latest('timestamp')
                last_view.status_code = response.status_code
                last_view.save(update_fields=['status_code'])
            except Exception:
                pass
        return response

    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '0.0.0.0')

    @staticmethod
    def parse_user_agent(user_agent):
        browser = 'Unknown'
        os_name = 'Unknown'
        device = 'desktop'

        if not user_agent:
            return browser, os_name, device

        ua = user_agent.lower()

        if 'chrome' in ua and 'edg' not in ua:
            browser = 'Chrome'
        elif 'safari' in ua and 'chrome' not in ua:
            browser = 'Safari'
        elif 'firefox' in ua:
            browser = 'Firefox'
        elif 'edg' in ua:
            browser = 'Edge'
        elif 'opera' in ua or 'opr' in ua:
            browser = 'Opera'
        elif 'msie' in ua or 'trident' in ua:
            browser = 'Internet Explorer'

        if 'windows' in ua:
            os_name = 'Windows'
        elif 'mac' in ua or 'darwin' in ua:
            os_name = 'macOS'
        elif 'linux' in ua:
            os_name = 'Linux'
        elif 'android' in ua:
            os_name = 'Android'
        elif 'iphone' in ua or 'ipad' in ua:
            os_name = 'iOS'

        if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
            device = 'mobile'
        elif 'tablet' in ua or 'ipad' in ua:
            device = 'tablet'

        return browser, os_name, device
