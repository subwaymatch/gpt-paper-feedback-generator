"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { pdfjs } from "react-pdf";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  readFileContent,
  readWordDocument,
  readPDFDocument,
  readPlainText,
} from "@/utils/fileUtils";

interface FileWithPreview {
  id: string;
  file: File;
  preview: string;
  loading: boolean;
}

export default function Home() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string>("");
  const [isWorkerReady, setIsWorkerReady] = useState(false);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    setIsWorkerReady(true);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isWorkerReady) {
      setError("PDF viewer is not ready yet. Please try again in a moment.");
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    setError("");

    // Filter out duplicates
    const duplicates = selectedFiles.filter((newFile) =>
      files.some((existingFile) => existingFile.file.name === newFile.name)
    );

    if (duplicates.length > 0) {
      setError(
        `File${duplicates.length > 1 ? "s" : ""} already added: ${duplicates
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // First, add all files to the list with loading state
    const newFiles = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: "Loading...",
      loading: true,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Then process each file
    for (const fileData of newFiles) {
      try {
        const content = await readFileContent(fileData.file);
        const preview =
          content.slice(0, 200) + (content.length > 200 ? "..." : "");

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id ? { ...f, preview, loading: false } : f
          )
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id
              ? { ...f, preview: "Error reading file content", loading: false }
              : f
          )
        );
        setError("Error reading some file contents. Please try again.");
        console.error(err);
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const resetFiles = () => {
    setFiles([]);
    setError("");
  };

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="p-4 lg:p-8 lg:sticky lg:top-0 lg:h-screen">
          <div className="max-w-xl space-y-2">
            <h1 className="text-2xl font-bold">GPT Paper Feedback Generator</h1>
            <p className="text-muted-foreground">
              Upload .doc, .docx, or .pdf files to generate feedback using one
              of the OpenAI models.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-slate-100 p-2 lg:p-4 relative min-h-screen">
          <div className="max-w-xl mx-auto space-y-6 pb-20">
            {" "}
            {/* Add padding bottom to prevent content overlap */}
            <Input
              type="file"
              accept=".doc,.docx,.pdf"
              onChange={handleFileChange}
              multiple
              className="cursor-pointer border-slate-200"
              disabled={!isWorkerReady}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              {files.map(({ id, file, preview, loading }) => (
                <Card key={id} className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Badge className="uppercase">
                        {file.name.split(".").pop()}
                      </Badge>
                      {file.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {loading && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        <p className="text-sm text-muted-foreground">
                          {preview}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {files.length > 0 && (
            <div className="fixed bottom-0 right-0 lg:w-1/2 bg-slate-100 border-t border-slate-200 p-4">
              <div className="max-w-xl mx-auto flex items-center justify-between">
                <p className="text-sm text-slate-600 font-semibold text-muted-foreground">
                  {files.length} file{files.length === 1 ? "" : "s"} selected
                </p>
                <div className="flex gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Reset</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will remove all uploaded files. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={resetFiles}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button>Submit</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
