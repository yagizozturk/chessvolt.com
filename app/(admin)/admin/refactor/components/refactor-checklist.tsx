"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckIcon, ChevronRightIcon, SearchIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  countCheckedInNode,
  countFilesInNode,
  type FolderTreeNode,
} from "../lib/build-folder-tree";

function loadCheckedFromStorage(storageKey: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const paths = JSON.parse(raw) as string[];
    if (!Array.isArray(paths)) return {};
    return Object.fromEntries(paths.map((path) => [path, true]));
  } catch {
    return {};
  }
}

function saveCheckedToStorage(storageKey: string, checked: Record<string, boolean>) {
  const done = Object.entries(checked)
    .filter(([, value]) => value)
    .map(([path]) => path);
  localStorage.setItem(storageKey, JSON.stringify(done));
}

function fileMatchesQuery(filePath: string, query: string) {
  return filePath.toLowerCase().includes(query);
}

function filterTree(nodes: FolderTreeNode[], query: string): FolderTreeNode[] {
  if (!query) return nodes;

  return nodes
    .map((node) => {
      const files = node.files.filter((file) => fileMatchesQuery(file, query));
      const children = filterTree(node.children, query);
      if (!files.length && !children.length) return null;
      return { ...node, files, children };
    })
    .filter((node): node is FolderTreeNode => node !== null);
}

function FileRow({
  filePath,
  checked,
  onToggle,
}: {
  filePath: string;
  checked: boolean;
  onToggle: (path: string) => void;
}) {
  const fileName = filePath.split("/").pop() ?? filePath;

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50">
      <span
        className={cn(
          "min-w-0 flex-1 font-mono text-sm",
          checked && "text-muted-foreground line-through",
        )}
      >
        {fileName}
      </span>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onToggle(filePath)}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-background hover:bg-muted",
        )}
      >
        {checked ? <CheckIcon className="size-3.5" strokeWidth={3} /> : null}
      </button>
    </label>
  );
}

function FolderSection({
  node,
  checked,
  onToggle,
  depth,
}: {
  node: FolderTreeNode;
  checked: Record<string, boolean>;
  onToggle: (path: string) => void;
  depth: number;
}) {
  const total = countFilesInNode(node);
  const done = countCheckedInNode(node, checked);
  const defaultOpen = depth < 2;

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/folder">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-muted/50">
        <ChevronRightIcon className="size-4 shrink-0 transition-transform group-data-[state=open]/folder:rotate-90" />
        <span className="min-w-0 flex-1 truncate font-medium">{node.name}</span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {done}/{total}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-l border-border/60 pl-3 ml-2 space-y-0.5">
        {node.children.map((child) => (
          <FolderSection
            key={child.path}
            node={child}
            checked={checked}
            onToggle={onToggle}
            depth={depth + 1}
          />
        ))}
        {node.files.map((filePath) => (
          <FileRow
            key={filePath}
            filePath={filePath}
            checked={Boolean(checked[filePath])}
            onToggle={onToggle}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

type Props = {
  tree: FolderTreeNode[];
  allPaths: string[];
  storageKey: string;
  itemLabel: string;
  emptyMessage?: string;
};

export function RefactorChecklist({
  tree,
  allPaths,
  storageKey,
  itemLabel,
  emptyMessage = "No items match your filters.",
}: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [hideDone, setHideDone] = useState(false);

  useEffect(() => {
    setChecked(loadCheckedFromStorage(storageKey));
    setHydrated(true);
  }, [storageKey]);

  const toggle = useCallback(
    (path: string) => {
      setChecked((prev) => {
        const next = { ...prev, [path]: !prev[path] };
        if (!next[path]) delete next[path];
        saveCheckedToStorage(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTree = useMemo(() => {
    let nodes = filterTree(tree, normalizedQuery);
    if (!hideDone) return nodes;

    const stripDone = (node: FolderTreeNode): FolderTreeNode | null => {
      const files = node.files.filter((file) => !checked[file]);
      const children = node.children
        .map(stripDone)
        .filter((child): child is FolderTreeNode => child !== null);
      if (!files.length && !children.length) return null;
      return { ...node, files, children };
    };

    nodes = nodes
      .map(stripDone)
      .filter((node): node is FolderTreeNode => node !== null);

    return nodes;
  }, [tree, normalizedQuery, hideDone, checked]);

  const total = allPaths.length;
  const done = allPaths.filter((path) => checked[path]).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {hydrated ? (
              <>
                <span className="font-medium text-foreground">{done}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span>{" "}
                {itemLabel} marked refactored
              </>
            ) : (
              "Loading saved progress…"
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Progress is stored in this browser&apos;s local storage.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(event) => setHideDone(event.target.checked)}
              className="size-4 rounded border-input"
            />
            Hide completed
          </label>
        </div>
      </div>

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by path…"
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card p-3 md:p-4">
        {filteredTree.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredTree.map((node) => (
              <FolderSection
                key={node.path}
                node={node}
                checked={checked}
                onToggle={toggle}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
