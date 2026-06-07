"use client";

import { Upload } from "lucide-react";
import { useState, useTransition } from "react";

import { importLichessRiddlesAction } from "./actions/import-lichess-riddles-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LichessRiddleImporterForm() {
  const [csvData, setCsvData] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [minPopularity, setMinPopularity] = useState("70");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!csvData.trim()) return;

    const formData = new FormData();
    formData.set("csvData", csvData);
    formData.set("minPopularity", minPopularity);

    startTransition(() => {
      void importLichessRiddlesAction(formData);
    });
  }

  const rowCount = csvData
    ? Math.max(0, csvData.split(/\r?\n/).filter((line) => line.trim()).length - 1)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="ring-border rounded-lg ring-1">
        <CardHeader>
          <CardTitle>Lichess CSV Import</CardTitle>
          <CardDescription>
            Upload a Lichess puzzle CSV. Themes are mapped deterministically from lichess-theme-map.json.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field>
            <FieldLabel>Min popularity</FieldLabel>
            <Input
              type="number"
              min={0}
              value={minPopularity}
              onChange={(e) => setMinPopularity(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>Upload CSV file</FieldLabel>
            <label className="border-input bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-md border border-dashed p-4 transition-colors">
              <span className="bg-background rounded-md border p-2">
                <Upload className="text-muted-foreground h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-sm font-medium">Choose CSV file</span>
                <span className="text-muted-foreground block text-xs">
                  {uploadedFileName || "Select a .csv file from your computer"}
                </span>
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadedFileName(file.name);
                  setCsvData(await file.text());
                }}
              />
            </label>
          </Field>

          {csvData ? <p className="text-muted-foreground text-xs">Loaded {rowCount} data rows (approx.)</p> : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={!csvData.trim() || isPending}>
              {isPending ? "Importing..." : "Import riddles"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
