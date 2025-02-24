import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODEL_DESCRIPTIONS } from "@/app/constants";

interface LeftColumnProps {
  prompt: string;
  setPrompt: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

export function LeftColumn({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
}: LeftColumnProps) {
  return (
    <div className="p-4 lg:p-8 lg:sticky lg:top-0 lg:h-screen">
      <div className="max-w-xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">GPT Paper Feedback Generator</h1>
          <p className="text-muted-foreground">
            Upload .doc, .docx, or .pdf files to generate feedback using one of
            the OpenAI models.
          </p>
        </div>

        {/* Prompt Section */}
        <div className="space-y-2">
          <Label htmlFor="prompt" className="font-semibold">
            Rubric (Prompt)
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your grading criteria or specific instructions for the AI..."
            className="min-h-[200px] resize-none"
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="font-semibold">
            Model
          </Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MODEL_DESCRIPTIONS).map(
                ([value, description]) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {selectedModel && (
            <p className="text-sm text-muted-foreground">
              {MODEL_DESCRIPTIONS[selectedModel]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
