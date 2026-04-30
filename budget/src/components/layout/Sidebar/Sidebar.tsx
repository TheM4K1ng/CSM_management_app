import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDropdownCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { IconBaseProps } from "react-icons";
import { TiFolderOpen } from "react-icons/ti";
import { useQueryClient } from "@tanstack/react-query";

import type { RecordNode } from "../../../types/recordNode";
import { fetchRecordChildren } from "../../../api/recordsApi";

import { useRecordRoots } from "./hooks/recordQuery";
import { useRecordSearch } from "./hooks/searchQuery";
import { useRecordChildren } from "./hooks/childrenQuery";

const OpenIcon = IoIosArrowDropdownCircle as unknown as React.FC<IconBaseProps>;
const ClosedIcon = IoIosArrowDroprightCircle as unknown as React.FC<IconBaseProps>;
const FolderIcon = <TiFolderOpen />;

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  onSelectRecord: (record: RecordNode) => void;
};

type RecordSearchHit = RecordNode & {
  parent_sys_id?: string | null;
  path?: Array<{ sys_id: string; name: string }>;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    ((parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase()) || "U"
  );
}
function TreeBranch({
  parentSysId,
  level,
  expanded,
  setExpanded,
  onSelectRecord,
  ensureChildrenLoaded,
  clickRef,
}: {
  parentSysId: string;
  level: number;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onSelectRecord: (r: RecordNode) => void;
  ensureChildrenLoaded: (sysId: string | null) => Promise<void>;
  clickRef: React.MutableRefObject<number | null>;
}) {
  const isExpanded = !!expanded[parentSysId];

  const { data: items = [], isLoading, error } = useRecordChildren(parentSysId, isExpanded);
  const errMsg = error ? (error as Error).message : null;

  function toggleRecord(node: RecordNode) {
    if (!node.has_children) return;

    const nextOpen = !expanded[node.sys_id];
    setExpanded((prev) => ({ ...prev, [node.sys_id]: nextOpen }));

    if (nextOpen) ensureChildrenLoaded(node.sys_id);
  }

  return (
    <div className="tree-level" style={{ marginInlineStart: level * 5 }}>
      {isLoading && <div className="muted">Loading...</div>}
      {errMsg && <div className="muted">ERROR: {errMsg}</div>}

      {!isLoading &&
        !errMsg &&
        items.map((g) => {
          const open = !!expanded[g.sys_id];
          const canExpand = g.has_children;

          return (
            <div key={g.sys_id}>
              <button
                type="button"
                className={canExpand ? "tree-row" : "tree-leaf"}
                onClick={(e) => {
                  e.stopPropagation();

                  if (clickRef.current) window.clearTimeout(clickRef.current);
                  clickRef.current = window.setTimeout(() => {
                    onSelectRecord(g);
                    clickRef.current = null;
                  }, 200);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();

                  if (clickRef.current) {
                    window.clearTimeout(clickRef.current);
                    clickRef.current = null;
                  }
                  if (canExpand) toggleRecord(g);
                }}
              >
                {FolderIcon}
                <span className="tree-label" dir="auto">
                  {g.name}
                </span>

                {canExpand && <span className="chev">{open ? <OpenIcon /> : <ClosedIcon />}</span>}
              </button>

              {canExpand && open && (
                <TreeBranch
                  parentSysId={g.sys_id}
                  level={level + 1}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  onSelectRecord={onSelectRecord}
                  ensureChildrenLoaded={ensureChildrenLoaded}
                  clickRef={clickRef}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}

export function Sidebar({ isOpen, onToggle, onSelectRecord }: SidebarProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const clickRef = useRef<number | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(t);
  }, [query]);

  const { data: roots = [], isLoading: rootsLoading, error: rootsError } = useRecordRoots(isOpen);

  const {
    data: results = [],
    isLoading: searching,
    error: searchError,
  } = useRecordSearch(debouncedQuery, isOpen);

  const rootsErr = rootsError ? (rootsError as Error).message : null;
  const searchErr = searchError ? (searchError as Error).message : null;

  const rootIconMap: Record<string, string> = {
    "root-0001": "units_icons/Alpha.jpg",
    "root-0002": "units_icons/Koren.png",
    "root-0003": "units_icons/Beta.png",
  };

  const isSearching = debouncedQuery.trim().length > 0;

  const qc = useQueryClient();

  const recordChildrenKey = (parentSysId: string | null) => 
  ["records", "children", parentSysId ?? "root"] as const;

  async function ensureChildrenLoaded(parentSysId: string | null) {
    await qc.prefetchQuery({
      queryKey: recordChildrenKey(parentSysId),
      queryFn: () => fetchRecordChildren(parentSysId),
      staleTime: 5 * 60_000,
    });
  }

  function toggleRoot(r: RecordNode) {
    if (!r.has_children) return;

    const nextOpen = !expanded[r.sys_id];
    setExpanded((prev) => ({ ...prev, [r.sys_id]: nextOpen }));

    if (nextOpen) ensureChildrenLoaded(r.sys_id);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <button className="btn-icon cursor-pointer" onClick={onToggle} type="button">
            {isOpen ? "✕" : "≡"}
          </button>

          {isOpen && (
            <input
              className="sidebar-search"
              placeholder="Search units..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
        </div>

        {isOpen && (
          <>
            <div className="sidebar-divider" />

            <div className="units-list">
              {isSearching ? (
                <div className="search-block">
                  {searching && <div className="search-status">Searching…</div>}
                  {searchErr && <div className="search-status">Error: {searchErr}</div>}

                  {!searching && !searchErr && results.length === 0 && (
                    <div className="search-status">No matches.</div>
                  )}

                  {!searching &&
                    !searchErr &&
                    results.map((hit: RecordSearchHit) => (
                      <button
                        key={hit.sys_id}
                        type="button"
                        className="search-hit"
                        onClick={async () => {
                          // expand path so it becomes visible in the tree
                          if (hit.path?.length) {
                            for (const p of hit.path.slice(0, -1)) {
                              setExpanded((prev) => ({ ...prev, [p.sys_id]: true }));
                              await ensureChildrenLoaded(p.sys_id);
                            }
                          } else {
                            const parentId = hit.parent_sys_id;
                            if (typeof parentId === "string" && parentId.length > 0) {
                              setExpanded((prev) => ({ ...prev, [parentId]: true }));
                              await ensureChildrenLoaded(parentId);
                            }
                          }

                          onSelectRecord(hit);
                        }}
                      >
                        {FolderIcon}
                        <span className="tree-label" dir="auto">
                          {hit.name}
                        </span>

                        {hit.path?.length ? (
                          <span className="search-hit-sub">
                            {hit.path.slice(0, -1).map((p) => p.name).join(" › ")}
                          </span>
                        ) : null}
                      </button>
                    ))}
                </div>
              ) : (
                <>
                  {rootsLoading && <div className="muted">Loading...</div>}
                  {rootsErr && <div className="muted">ERROR: {rootsErr}</div>}

                  {!rootsLoading &&
                    !rootsErr &&
                    roots.map((r) => {
                      const isOpenRoot = !!expanded[r.sys_id];
                      const canExpand = r.has_children;
                      const icon = rootIconMap[r.sys_id];

                      return (
                        <div key={r.sys_id} className="sidebar-unit-block">
                          <button
                            className={`unit-row ${isOpenRoot ? "active" : ""}`}
                            type="button"
                            onClick={() => {
                              onSelectRecord(r);
                              if (canExpand) toggleRoot(r);
                            }}
                          >
                            <span className="unit-chev" aria-hidden="true">
                              {canExpand ? (isOpenRoot ? <OpenIcon /> : <ClosedIcon />) : null}
                            </span>

                            <span className="unit-name">{r.name}</span>
                            {FolderIcon}

                            <span className="unit-avatar-wrap">
                              {icon ? (
                                <img className="unit-avatar" src={icon} alt="" />
                              ) : (
                                <div className="unit-avatar fallback">{initials(r.name)}</div>
                              )}
                            </span>
                          </button>

                          {canExpand && isOpenRoot && (
                            <TreeBranch
                              parentSysId={r.sys_id}
                              level={0}
                              expanded={expanded}
                              setExpanded={setExpanded}
                              onSelectRecord={onSelectRecord}
                              ensureChildrenLoaded={ensureChildrenLoaded}
                              clickRef={clickRef}
                            />
                          )}
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}