"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LeftColumn } from "./_components/LeftColumn";
import { FileCard } from "./_components/FileCard";
import { BottomBar } from "./_components/BottomBar";
import { readFileContent } from "@/utils/fileUtils";
import { pdfjs } from "react-pdf";
import { MODEL_DESCRIPTIONS } from "@/app/constants";

interface FileWithPreview {
  id: string;
  file: File;
  preview: string;
  loading: boolean;
}

export default function Home() {
  // Get the first model from MODEL_DESCRIPTIONS
  const defaultModel = Object.keys(MODEL_DESCRIPTIONS)[0];
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string>("");
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [prompt, setPrompt] = useState<string>("");

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
        <LeftColumn
          prompt={prompt}
          setPrompt={setPrompt}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        {/* Right Column */}
        <div className="bg-slate-100 p-2 lg:p-4 relative min-h-screen">
          <div className="max-w-xl mx-auto space-y-6 pb-20">
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
              {files.map((file) => (
                <FileCard key={file.id} {...file} onRemove={removeFile} />
              ))}
            </div>
          </div>

          {files.length > 0 && (
            <BottomBar
              filesCount={files.length}
              onReset={resetFiles}
              onSubmit={() => {}} // Implement submit handler
            />
          )}
        </div>
      </div>
    </main>
  );
}
