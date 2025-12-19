from django.http import HttpResponse
from django.views import View
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from content.models import YouthStatistics


class YouthStatisticsPDFView(View):
    """Генерация PDF отчета со статистикой молодежи"""
    
    def get(self, request):
        # Получаем текущую статистику
        stats = YouthStatistics.get_instance()
        
        # Создаем PDF в памяти
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Позиция Y
        y = height - 2*cm
        
        # Заголовок
        pdf.setFont("Helvetica-Bold", 24)
        pdf.setFillColor(colors.HexColor('#1e40af'))
        title_text = "STATISTIKA MOLODEZHI"
        title_width = pdf.stringWidth(title_text, "Helvetica-Bold", 24)
        pdf.drawString((width - title_width) / 2, y, title_text)
        y -= 1.5*cm
        
        # Дата
        pdf.setFont("Helvetica", 10)
        pdf.setFillColor(colors.black)
        date_text = f"Data formirovaniya: {datetime.now().strftime('%d.%m.%Y %H:%M')}"
        pdf.drawString(2*cm, y, date_text)
        y -= 1*cm
        
        # Таблицы
        elements = []
        
        # ОСНОВНАЯ СТАТИСТИКА
        basic_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Umumiy yoshlar soni', f'{stats.total_youth:,}'.replace(',', ' ')],
            ['Erkaklar soni', f'{stats.male_count:,}'.replace(',', ' ')],
            ['Ayollar soni', f'{stats.female_count:,}'.replace(',', ' ')],
        ]
        elements.append(('OSNOVNAYA STATISTIKA', basic_data, colors.HexColor('#3b82f6')))
        
        # ОБРАЗОВАНИЕ
        education_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Oliy ma\'lumotli', f'{stats.higher_education:,}'.replace(',', ' ')],
            ['O\'rta ma\'lumotli', f'{stats.secondary_education:,}'.replace(',', ' ')],
            ['Chet el oliygohlarini bitirgan', f'{stats.foreign_graduates:,}'.replace(',', ' ')],
            ['TOP 300 bitirgan', f'{stats.top300_graduates:,}'.replace(',', ' ')],
            ['TOP 500 bitirgan', f'{stats.top500_graduates:,}'.replace(',', ' ')],
        ]
        elements.append(('TA\'LIM', education_data, colors.HexColor('#10b981')))
        
        # СОТРУДНИКИ
        staff_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Texnik xodimlar', f'{stats.technical_staff:,}'.replace(',', ' ')],
            ['Xizmat ko\'rsatuvchi xodimlar', f'{stats.service_staff:,}'.replace(',', ' ')],
            ['Lavozimi ko\'tarilgan yoshlar', f'{stats.promoted_youth:,}'.replace(',', ' ')],
        ]
        elements.append(('XODIMLAR', staff_data, colors.HexColor('#8b5cf6')))
        
        # ЯЗЫКОВЫЕ СЕРТИФИКАТЫ
        lang_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Til sertifikatiga ega', f'{stats.language_cert_total:,}'.replace(',', ' ')],
            ['- IELTS', f'{stats.ielts_count:,}'.replace(',', ' ')],
            ['- CEFR', f'{stats.cefr_count:,}'.replace(',', ' ')],
            ['- TOPIK', f'{stats.topik_count:,}'.replace(',', ' ')],
        ]
        elements.append(('TIL SERTIFIKATLARI', lang_data, colors.HexColor('#0891b2')))
        
        # НАУЧНЫЕ СТЕПЕНИ
        science_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Ilmiy darajaga ega', f'{stats.scientific_degree_total:,}'.replace(',', ' ')],
            ['- PhD', f'{stats.phd_count:,}'.replace(',', ' ')],
            ['- DSc', f'{stats.dsc_count:,}'.replace(',', ' ')],
            ['- Talabgorlar', f'{stats.candidate_count:,}'.replace(',', ' ')],
        ]
        elements.append(('ILMIY DARAJALAR', science_data, colors.HexColor('#10b981')))
        
        # МОЛОДЫЕ ЛИДЕРЫ  
        leaders_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Yosh rahbarlar', f'{stats.young_leaders_total:,}'.replace(',', ' ')],
            ['- Direktorlar', f'{stats.directors_count:,}'.replace(',', ' ')],
            ['- Boshliqlalar', f'{stats.heads_count:,}'.replace(',', ' ')],
            ['- Menejerlar', f'{stats.managers_count:,}'.replace(',', ' ')],
        ]
        elements.append(('YOSH RAHBARLAR', leaders_data, colors.HexColor('#f59e0b')))
        
        # ГОСУДАРСТВЕННЫЕ НАГРАДЫ
        awards_data = [
            ['Ko\'rsatkich', 'Qiymat'],
            ['Davlat mukofoti bilan', f'{stats.state_awards_total:,}'.replace(',', ' ')],
            ['- Ordenlar', f'{stats.orders_count:,}'.replace(',', ' ')],
            ['- Medallar', f'{stats.medals_count:,}'.replace(',', ' ')],
            ['- Faxriy unvonlar', f'{stats.honorary_count:,}'.replace(',', ' ')],
        ]
        elements.append(('DAVLAT MUKOFO TLARI', awards_data, colors.HexColor('#e11d48')))
        
        # Рисуем все элементы
        for i, (title, data, color) in enumerate(elements):
            if y < 5*cm:  # Новая страница если места мало
                pdf.showPage()
                y = height - 2*cm
            
            # Заголовок раздела
            pdf.setFont("Helvetica-Bold", 14)
            pdf.setFillColor(color)
            pdf.drawString(2*cm, y, f"{i+1}. {title}")
            y -= 0.8*cm
            pdf.setFillColor(colors.black)
            
            # Таблица
            table = Table(data, colWidths=[12*cm, 5*cm])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), color),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
            ]))
            
            # Рисуем таблицу
            table_height = len(data) * 0.6*cm
            table.wrapOn(pdf, width, height)
            table.drawOn(pdf, 2*cm, y - table_height)
            y -= (table_height + 0.5*cm)
        
        # Подвал
        if y < 3*cm:
            pdf.showPage()
            y = height - 2*cm
        
        pdf.setFont("Helvetica-Oblique", 9)
        pdf.setFillColor(colors.grey)
        footer_text = f"Yangilangan: {stats.last_updated.strftime('%d.%m.%Y %H:%M')}"
        if stats.updated_by:
            name = f"{stats.updated_by.first_name} {stats.updated_by.last_name}".strip() or stats.updated_by.username
            footer_text += f" | Kim: {name}"
        pdf.drawString(2*cm, y, footer_text)
        
        # Завершаем PDF
        pdf.save()
        
        # Возвращаем PDF
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="youth_statistics_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"'
        
        return response
