# oridb/models.py
from django.db import models
from django.db.models import Q, F


class Record(models.Model):
    sys_id = models.TextField(primary_key=True)

    u_sso_id_name = models.TextField(blank=True)
    name = models.TextField()

    parent = models.ForeignKey(
        "self",
        to_field="sys_id",
        db_column="parent",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.SET_NULL,
    )

    description = models.TextField(blank=True)
    sys_updated_on = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "record"
        indexes = [
            models.Index(fields=["parent"]),
            models.Index(fields=["sys_updated_on"]),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~Q(sys_id=F("parent")),
                name="record_parent_not_self",
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.sys_id})"
    

class CustomerMeeting(models.Model):
    record = models.ForeignKey(
        "Record",
        to_field="sys_id",
        db_column="record",
        on_delete=models.PROTECT,
        related_name="meetings",
    )

    customer_name = models.TextField()
    date = models.DateField()
    summary = models.TextField(blank=True)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "customer_meeting"
        indexes = [
            models.Index(fields=["record"]),
            models.Index(fields=["date"])
        ]
