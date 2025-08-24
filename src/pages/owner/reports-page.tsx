"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthenticatedFetch } from "@/hooks/useAuth";
import type {
  CallLogListResponse,
  CallLogSummary,
  CallLogDetailResponse,
} from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

function calcDuration(startIso?: string, endIso?: string | null) {
  if (!startIso || !endIso) return "-";
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (ms <= 0) return "-";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export default function OrgOwnerReports() {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [locationId, setLocationId] = useState<string | undefined>();
  const [data, setData] = useState<CallLogListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("size", String(size));
      if (locationId) qs.set("locationId", locationId);

      const res = await authenticatedFetch(
        `/org-owner/reports/call-logs?${qs.toString()}`,
        { method: "GET" }
      );
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 403) throw new Error("Forbidden");
        throw new Error(`Request failed: ${res.status}`);
      }
      const json = (await res.json()) as CallLogListResponse;
      setData(json);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch, page, size, locationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = data?.totalPages ?? 0;
  const calls: CallLogSummary[] = data?.calls ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CallLogDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadDetail = useCallback(
    async (id: string) => {
      setDetailLoading(true);
      setDetailError(null);
      setDetail(null);
      try {
        const res = await authenticatedFetch(
          `/org-owner/reports/call-logs/${id}`
        );
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const json = (await res.json()) as CallLogDetailResponse;
        setDetail(json);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load detail";
        setDetailError(msg);
      } finally {
        setDetailLoading(false);
      }
    },
    [authenticatedFetch]
  );

  return (
    <>
      <Card className="w-[90%] md:w-[70%] mt-6">
        <CardHeader className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl">Call Logs</CardTitle>
            <CardDescription>
              Call logs for your organization. Filter by location when needed.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter by locationId"
              value={locationId ?? ""}
              onChange={(e) => setLocationId(e.target.value || undefined)}
              className="w-56"
            />
            <Select
              value={String(size)}
              onValueChange={(v) => setSize(Number(v))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rows/page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}/page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => setPage(0)}
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="py-6 text-sm text-muted-foreground">Loading…</div>
          )}
          {error && (
            <div className="py-6 text-sm text-destructive">{error}</div>
          )}

          {!loading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Created</TableHead>
                    <TableHead className="text-center">From</TableHead>
                    <TableHead className="text-center">To</TableHead>
                    <TableHead className="text-center">Location</TableHead>
                    <TableHead className="text-center">Duration</TableHead>
                    <TableHead className="text-center">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.length ? (
                    calls.map((c) => (
                      <TableRow key={c.id} className="h-12">
                        <TableCell className="text-center">
                          {formatDate(c.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          {c.fromNumber ?? c.fromNumberRaw ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {c.toNumber}
                        </TableCell>
                        <TableCell className="text-center">
                          {c.locationId ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {calcDuration(c.createdAt, c.endedAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => {
                              setSelectedId(c.id);
                              loadDetail(c.id);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 px-3 bg-transparent"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page <= 0}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                className="h-8 px-3 bg-transparent"
                onClick={() =>
                  setPage((p) =>
                    totalPages ? Math.min(p + 1, totalPages - 1) : p + 1
                  )
                }
                disabled={totalPages ? page >= totalPages - 1 : false}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setDetail(null);
            setDetailError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Detail</DialogTitle>
            <DialogDescription>
              {detail
                ? `Stream ${detail.streamSid}`
                : selectedId
                ? "Loading…"
                : ""}
            </DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="text-sm text-muted-foreground">Loading detail…</div>
          )}
          {detailError && (
            <div className="text-sm text-destructive">{detailError}</div>
          )}
          {detail && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="text-sm">{formatDate(detail.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Ended</div>
                  <div className="text-sm">
                    {formatDate(detail.endedAt ?? undefined)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="text-sm">
                    {calcDuration(detail.createdAt, detail.endedAt)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">From</div>
                  <div className="text-sm">
                    {detail.fromNumber ?? detail.fromNumberRaw ?? "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">To</div>
                  <div className="text-sm">{detail.toNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="text-sm">{detail.locationId ?? "-"}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Transcript</div>
                <div className="space-y-3 max-h-80 overflow-auto pr-1">
                  {detail.transcript.map((t) => {
                    const sp = (t.speaker || "").toUpperCase();
                    const isUser = sp === "USER" || sp === "CALLER";
                    return (
                      <div
                        key={t.timestamp}
                        className={`flex ${
                          isUser ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            isUser ? "bg-muted" : "bg-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">
                              {t.speaker}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(t.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">
                            {t.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Function Calls</div>
                <div className="space-y-4 max-h-80 overflow-auto pr-1">
                  {detail.functionCalls.map((f) => (
                    <div
                      key={`${f.timestamp}-${f.callId ?? f.functionName}`}
                      className="rounded-md border p-3 space-y-2 max-w-[44rem]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {f.functionName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(f.timestamp)}
                        </div>
                      </div>
                      <JsonBlock title="Arguments" jsonString={f.arguments} />
                      {f.result !== undefined && (
                        <JsonBlock title="Result" jsonString={f.result} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function JsonBlock({
  title,
  jsonString,
}: {
  title: string;
  jsonString?: string;
}) {
  let content: unknown = undefined;
  if (jsonString) {
    try {
      content = JSON.parse(jsonString);
    } catch {
      content = jsonString;
    }
  }
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{title}</div>
      <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-64">
        {content ? JSON.stringify(content, null, 2) : "-"}
      </pre>
    </div>
  );
}
