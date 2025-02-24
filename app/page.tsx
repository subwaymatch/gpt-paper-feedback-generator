"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import mammoth from "mammoth";
import { pdfjs } from "react-pdf";

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
          content.slice(0, 100) + (content.length > 100 ? "..." : "");

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

  const readWordDocument = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const readPDFDocument = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text.trim();
  };

  const readPlainText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const readFileContent = async (file: File): Promise<string> => {
    if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
      return await readWordDocument(file);
    } else if (file.name.endsWith(".pdf")) {
      return await readPDFDocument(file);
    } else {
      return "Unsupported file type";
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">File Upload</h1>
          <p className="text-muted-foreground">
            Upload .doc, .docx, or .pdf files to preview their content
          </p>
        </div>

        <Input
          type="file"
          accept=".doc,.docx,.pdf"
          onChange={handleFileChange}
          multiple
          className="cursor-pointer"
          disabled={!isWorkerReady}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {files.map(({ id, file, preview, loading }) => (
            <Card key={id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
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
                <div className="flex items-center gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <p className="text-sm text-muted-foreground">{preview}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
