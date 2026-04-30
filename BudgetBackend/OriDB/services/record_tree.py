from typing import List
from django.db import connection

def get_subtree_sys_ids(root_sys_id: str, include_root: bool = True) -> List[str]:
    """
    returns sys_ids in the subtree under root_sys_id (optionally including root).
    """
    sql = """
    WITH RECURSIVE tree AS (
        SELECT sys_id, parent
        FROM record
        WHERE sys_id = %s
        
        UNION ALL
        
        SELECT r.sys_id, r.parent
        FROM record r
        INNER JOIN tree t ON  r.parent = t.sys_id)
    SELECT sys_id FROM tree;    
    """

    with connection.cursor() as cursor:
        cursor.execute(sql, [root_sys_id])
        rows = cursor.fetchall()

    sys_ids = [r[0] for r in rows]
    if not include_root and sys_ids:
        sys_ids = [x for x in sys_ids if x != root_sys_id]
    return sys_ids        