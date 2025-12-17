#!/usr/bin/env python
"""
Test ma'lumotlar yaratish scripti
Dashboard va Frontend uchun
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from datetime import date, timedelta
from content.models import News, Grant, Scholarship, Competition, Innovation, Internship, Job, TeamMember
from users.models import User
from organisation.models import Organisation

def create_test_data():
    print("🚀 Test ma'lumotlar yaratilmoqda...\n")
    
    # 1. Organisation
    org, created = Organisation.objects.get_or_create(
        name="O'zbekneftgaz",
        defaults={
            'email': 'info@ung.uz',
            'phone': '+998712345678',
            'address': 'Toshkent, O\'zbekiston'
        }
    )
    print(f"✅ Organisation: {org.name} {'(created)' if created else '(exists)'}")
    
    # 2. Yangiliklar (5 ta)
    news_data = [
        {
            'title_uz': "UNG yoshlar platformasi ishga tushdi",
            'title_ru': "Запущена молодежная платформа UNG",
            'title_en': "UNG Youth Platform launched",
            'content_uz': "<p>O'zbekneftgaz kompaniyasi yoshlar uchun yangi raqamli platforma ishga tushirdi. Bu platforma grantlar, stipendiyalar va stajirovkalar haqida ma'lumot beradi.</p>",
            'content_ru': "<p>Компания Узбекнефтегаз запустила новую цифровую платформу для молодежи. Эта платформа предоставляет информацию о грантах, стипендиях и стажировках.</p>",
            'content_en': "<p>Uzbekneftegaz company launched a new digital platform for youth. This platform provides information about grants, scholarships and internships.</p>",
            'is_featured': True
        },
        {
            'title_uz': "Yangi innovatsion loyiha e'lon qilindi",
            'title_ru': "Объявлен новый инновационный проект",
            'title_en': "New innovation project announced",
            'content_uz': "<p>Kompaniya yoshlar uchun innovatsion g'oyalarni qo'llab-quvvatlash dasturini boshladi.</p>",
            'content_ru': "<p>Компания запустила программу поддержки инновационных идей для молодежи.</p>",
            'content_en': "<p>The company launched a program to support innovative ideas for youth.</p>",
            'is_featured': True
        },
        {
            'title_uz': "Xalqaro konferensiya bo'lib o'tdi",
            'title_ru': "Прошла международная конференция",
            'title_en': "International conference held",
            'content_uz': "<p>UNG yoshlar platformasi doirasida xalqaro konferensiya tashkil etildi.</p>",
            'content_ru': "<p>В рамках молодежной платформы UNG была организована международная конференция.</p>",
            'content_en': "<p>An international conference was organized within the UNG youth platform.</p>",
            'is_featured': False
        }
    ]
    
    news_count = 0
    for data in news_data:
        news, created = News.objects.get_or_create(
            title_uz=data['title_uz'],
            defaults={
                **data,
                'date': date.today() - timedelta(days=news_count),
                'is_published': True,
                'views': (3 - news_count) * 150,
                'likes': (3 - news_count) * 25,
            }
        )
        if created:
            news_count += 1
            print(f"  ✅ Yangilik: {news.title_uz}")
    
    print(f"\n📰 {news_count} ta yangilik yaratildi\n")
    
    # 3. Grantlar (3 ta)
    grants_data = [
        {
            'title_uz': "Innovatsiya granti",
            'title_ru': "Инновационный грант",
            'title_en': "Innovation Grant",
            'short_description_uz': "Innovatsion loyihalar uchun moliyaviy yordam",
            'short_description_ru': "Финансовая поддержка для инновационных проектов",
            'short_description_en': "Financial support for innovation projects",
            'content_uz': "<p>Innovatsion g'oyalarni amalga oshirish uchun grant.</p>",
            'content_ru': "<p>Грант для реализации инновационных идей.</p>",
            'content_en': "<p>Grant for implementing innovative ideas.</p>",
            'amount': "$50,000 gacha",
            'duration': "12 oy",
            'category': 'innovation',
            'status': 'active'
        },
        {
            'title_uz': "Ekologiya granti",
            'title_ru': "Экологический грант",
            'title_en': "Ecology Grant",
            'short_description_uz': "Ekologik loyihalar uchun",
            'short_description_ru': "Для экологических проектов",
            'short_description_en': "For ecological projects",
            'content_uz': "<p>Ekologiya sohasida ishlaydigan loyihalar uchun grant.</p>",
            'content_ru': "<p>Грант для проектов в области экологии.</p>",
            'content_en': "<p>Grant for projects in the field of ecology.</p>",
            'amount': "$30,000 gacha",
            'duration': "9 oy",
            'category': 'ecology',
            'status': 'active'
        }
    ]
    
    grants_count = 0
    for data in grants_data:
        grant, created = Grant.objects.get_or_create(
            title_uz=data['title_uz'],
            defaults={
                **data,
                'deadline': date.today() + timedelta(days=60),
                'applicants': grants_count * 15
            }
        )
        if created:
            grants_count += 1
            print(f"  ✅ Grant: {grant.title_uz}")
    
    print(f"\n🏆 {grants_count} ta grant yaratildi\n")
    
    # 4. Stipendiyalar (2 ta)
    scholarships_data = [
        {
            'title_uz': "Magistratura stipendiyasi",
            'title_ru': "Стипендия на магистратуру",
            'title_en': "Master's Scholarship",
            'short_description_uz': "Magistratura uchun to'liq stipendiya",
            'short_description_ru': "Полная стипендия для магистратуры",
            'short_description_en': "Full scholarship for master's degree",
            'content_uz': "<p>Xorijda o'qish uchun to'liq stipendiya.</p>",
            'content_ru': "<p>Полная стипендия для обучения за рубежом.</p>",
            'content_en': "<p>Full scholarship for studying abroad.</p>",
            'amount': "$25,000/yil",
            'duration': "2 yil",
            'category': 'master',
            'status': 'active'
        }
    ]
    
    schol_count = 0
    for data in scholarships_data:
        schol, created = Scholarship.objects.get_or_create(
            title_uz=data['title_uz'],
            defaults={
                **data,
                'deadline': date.today() + timedelta(days=45),
                'recipients': 0
            }
        )
        if created:
            schol_count += 1
            print(f"  ✅ Stipendiya: {schol.title_uz}")
    
    print(f"\n🎓 {schol_count} ta stipendiya yaratildi\n")
    
    # 5. Konkurslar
    comp_data = [
        {
            'title_uz': "IT loyihalar konkursi",
            'title_ru': "Конкурс IT проектов",
            'title_en': "IT Projects Competition",
            'short_description_uz': "Eng yaxshi IT loyiha tanlovi",
            'short_description_ru': "Конкурс лучших IT проектов",
            'short_description_en': "Best IT project competition",
            'content_uz': "<p>Yoshlar IT loyihalarini taqdim etishlari mumkin.</p>",
            'content_ru': "<p>Молодежь может представить свои IT проекты.</p>",
            'content_en': "<p>Youth can present their IT projects.</p>",
            'category': 'professional',
            'status': 'active',
            'prize': "$10,000"
        }
    ]
    
    comp_count = 0
    for data in comp_data:
        comp, created = Competition.objects.get_or_create(
            title_uz=data['title_uz'],
            defaults={
                **data,
                'start_date': date.today() + timedelta(days=30),
                'end_date': date.today() + timedelta(days=90),
                'registration_deadline': date.today() + timedelta(days=20),
                'participants': 0
            }
        )
        if created:
            comp_count += 1
            print(f"  ✅ Konkurs: {comp.title_uz}")
    
    print(f"\n🏅 {comp_count} ta konkurs yaratildi\n")
    
    # 6. Jamoa a'zolari
    team_data = [
        {
            'name_uz': "Alisher Valiyev",
            'name_ru': "Алишер Валиев",
            'name_en': "Alisher Valiyev",
            'position_uz': "Platforma rahbari",
            'position_ru': "Руководитель платформы",
            'position_en': "Platform Manager",
            'bio_uz': "10 yillik tajribaga ega IT mutaxassis",
            'bio_ru': "IT специалист с 10-летним опытом",
            'bio_en': "IT specialist with 10 years of experience",
            'email': 'alisher@ung.uz',
            'phone': '+998901234567',
            'order': 1
        }
    ]
    
    team_count = 0
    for data in team_data:
        member, created = TeamMember.objects.get_or_create(
            email=data['email'],
            defaults=data
        )
        if created:
            team_count += 1
            print(f"  ✅ Jamoa: {member.name_uz}")
    
    print(f"\n👥 {team_count} ta jamoa a'zosi yaratildi\n")
    
    print("\n" + "="*60)
    print("✅ BARCHA TEST MA'LUMOTLAR YARATILDI!")
    print("="*60)
    print(f"\n📊 Jami:")
    print(f"  📰 Yangiliklar: {News.objects.count()}")
    print(f"  🏆 Grantlar: {Grant.objects.count()}")
    print(f"  🎓 Stipendiyalar: {Scholarship.objects.count()}")
    print(f"  🏅 Konkurslar: {Competition.objects.count()}")
    print(f"  👥 Jamoa: {TeamMember.objects.count()}")
    print(f"\n🌐 Frontend da ko'rish: http://localhost:5173/")
    print(f"👨‍💼 Dashboard: http://localhost:5175/")

if __name__ == '__main__':
    create_test_data()

