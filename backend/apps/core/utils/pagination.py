def pagination(queryset, serializer, page, size=15):
    page = page or 1
    offset = (page - 1) * size
    limit = offset + size
    serializer.instance = queryset[offset:limit]
    return {'count': queryset.count(), 'results': serializer.data}


def pagination_search(queryset1, queryset2, queryset3, queryset4, serializer1, serializer2, serializer3, serializer4,
                      page, size=15):
    serializer = {
        'categories': serializer1,
        'category_items': serializer2,
        'courses': serializer3,
        'teachers': serializer4
    }
    page = page or 1
    offset = (page - 1) * size
    limit = offset + size
    serializer1.instance = queryset1[offset:limit]
    serializer2.instance = queryset2[offset:limit]
    serializer3.instance = queryset3[offset:limit]
    serializer4.instance = queryset4[offset:limit]
    return {'count': queryset1.count() + queryset2.count() + queryset3.count() + queryset4.count(),
            'results': serializer}
