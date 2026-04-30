from django.db.models import Exists, OuterRef, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Record
from .serializers import RecordSerializer, RecordSearchSerializer
from .services.record_tree import get_subtree_sys_ids

def build_path(node):
    path = []
    cur = node
    guard = 0
    while cur is not None and guard < 50:
        path.append({"sys_id": cur.sys_id, "name": cur.name})
        cur = cur.parent
        guard += 1
    return list(reversed(path))    

class RecordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecordSerializer
    lookup_field = "sys_id"

    def get_queryset(self):
        child_qs = Record.objects.filter(parent=OuterRef("sys_id"))

        qs = (
            Record.objects
            .all()
            .annotate(has_children=Exists(child_qs))
            .order_by("name")
        )

        q = self.request.query_params.get("q")
        if q:
            q = q.strip()
            qs = qs.filter(
                Q(name__icontains=q) |
                Q(u_sso_id_name__icontains=q) |
                Q(sys_id__icontains=q) 
            )

        parent_param = self.request.query_params.get("parent", None)

        if parent_param is None:
            return qs
        
        if parent_param.lower() in {"null", "none", ""}:
            return qs.filter(parent__isnull=True)
        
        return qs.filter(parent_id=parent_param)
    
    @action(detail=True, methods=["get"], url_path="children")
    def children(self, request, sys_id=None):

        child_qs = Record.objects.filter(parent=OuterRef("sys_id"))
        qs = (
            Record.objects
            .filter(parent_id=sys_id)
            .annotate(has_children=Exists(child_qs))
            .order_by("name")
        )

        return Response(self.get_serializer(qs, many=True).data)
    
    @action(detail=True, methods=["get"], url_path="subtree")
    def subtree(self, request, sys_id=None):
        """
        GET /api/records/<sys_id>/subtree/?include_root=true|false
        returns sys_ids in the subtree.
        """
        include_root_param = request.query_params.get("include_root", "true").strip().lower()
        include_root = include_root_param not in {"false", "0", "no"}

        ids = get_subtree_sys_ids(sys_id, include_root=include_root)
        return Response({
            "root": sys_id,
            "count": len(ids),
            "sys_ids": ids,
        })
    

    @action(detail=True, methods=["get"], url_path="subtree-records")
    def subtree_records(self, request, sys_id=None):
        """
        GET /api/records/<sys_id>/subtree-records/?include_root=true|false
        Returns full Record objects in the subtree with has_children.
        """
        include_root_param = request.query_params.get("include_root", "true").strip().lower()
        include_root = include_root_param not in {"false", "0", "no"}

        ids = get_subtree_sys_ids(sys_id, include_root=include_root)

        child_qs = Record.objects.filter(parent=OuterRef("sys_id"))
        qs = (
            Record.objects
            .filter(sys_id__in=ids)
            .annotate(has_children=Exists(child_qs))
            .order_by("name")
        )

        return Response(self.get_serializer(qs, many=True).data)
    
    @action(detail=True, methods=["get"], url_path="node")
    def node(self, request, sys_id=None):
        """
        GET /api/records/<sys_id>/node/
        Returns:
          - node: the selected record (with has_children)
          - children: immediate children (with has_children)
        """
        child_qs = Record.objects.filter(parent=OuterRef("sys_id"))

        node = (
            Record.objects
            .filter(sys_id=sys_id)
            .annotate(has_children=Exists(child_qs))
            .first()
        )
        if not node:
            return Response({"detail": "Not found."}, status=404)

        children = (
            Record.objects
            .filter(parent_id=sys_id)
            .annotate(has_children=Exists(child_qs))
            .order_by("name")
        )

        return Response({
            "node": RecordSerializer(node).data,
            "children": RecordSerializer(children, many=True).data,
        })
    
    @action(detail=False, methods=["get"], url_path="roots")
    def roots(self, request):
        child_qs = Record.objects.filter(parent=OuterRef("sys_id"))
        qs = (
            Record.objects
            .filter(parent__isnull=True)
            .annotate(has_children=Exists(child_qs))
            .order_by("name")
        )
        return Response(self.get_serializer(qs, many=True).data)
    
    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        q = (request.query_params.get("q") or "").strip()

        if not q:
            return Response([])
        
        child_qs = Record.objects.filter(parent=OuterRef("sys_id"))

        qs = (
            Record.objects
            .all()
            .annotate(has_children=Exists(child_qs))
            .filter(
                Q(name__icontains=q) |
                Q(u_sso_id_name__icontains=q) |
                Q(sys_id__icontains=q)
            )
            .select_related("parent")
            .order_by("name")[:100]
        )

        hits = list(qs)
        out = []
        for r in hits:
            row = RecordSearchSerializer(r).data
            row["path"] = build_path(r)
            out.append(row)
        return Response(out)    