from core.querysets.base_queryset import BaseQuerySet


class OrganisationQuerySet(BaseQuerySet):
    def list(self):
        query = self.all()
        return query.order_by('-created_at')
