import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from OriDB.models import Record


def rand_date(days_back: int = 180):
    return date.today() - timedelta(days=random.randint(0, days_back))


class Command(BaseCommand):
    help = "Seed mock Record hierarchy data for local/dev E2E testing."

    def add_arguments(self, parser):
        parser.add_argument("--truncate", action="store_true", help="Delete all existing records first")
        parser.add_argument("--roots", type=int, default=6, help="Number of root records")
        parser.add_argument("--depth", type=int, default=4, help="Max depth (>=1)")
        parser.add_argument("--branch", type=int, default=4, help="Children per node (avg-ish)")
        parser.add_argument("--seed", type=int, default=42, help="Random seed for stable output")

    @transaction.atomic
    def handle(self, *args, **opts):
        random.seed(opts["seed"])

        if opts["truncate"]:
            Record.objects.all().delete()
            self.stdout.write("Deleted existing records.")

        roots = opts["roots"]
        depth = max(1, opts["depth"])
        branch = max(1, opts["branch"])

        created = 0

        def make_sys_id(prefix: str, i: int) -> str:
            # looks like a sys_id but readable; good for debugging
            return f"{prefix}-{i:04d}"

        # Create roots
        root_nodes = []
        for i in range(1, roots + 1):
            r = Record.objects.create(
                sys_id=make_sys_id("root", i),
                u_sso_id_name=f"root_owner_{i}",
                name=f"Root {i}",
                parent=None,
                description=f"Root node {i}",
                sys_updated_on=rand_date(),
            )
            root_nodes.append(r)
            created += 1

        # Expand tree
        counter = roots
        current_level = root_nodes

        for d in range(2, depth + 1):
            next_level = []
            for parent in current_level:
                # vary number of children a bit
                n_children = max(0, int(random.gauss(mu=branch, sigma=max(1, branch // 2))))
                # keep it bounded
                n_children = min(n_children, branch * 2)

                for _ in range(n_children):
                    counter += 1
                    child = Record.objects.create(
                        sys_id=make_sys_id(f"lvl{d}", counter),
                        u_sso_id_name=f"user_{random.randint(1, 200)}",
                        name=f"Level {d} Node {counter}",
                        parent=parent,
                        description=f"Child of {parent.sys_id}",
                        sys_updated_on=rand_date(),
                    )
                    next_level.append(child)
                    created += 1

            # if the tree gets too sparse, stop early
            if not next_level:
                break
            current_level = next_level

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} records."))
        self.stdout.write("Tip: roots are /api/records/?parent=null")
