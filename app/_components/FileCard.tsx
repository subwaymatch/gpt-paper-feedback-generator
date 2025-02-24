import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";

interface FileCardProps {
  id: string;
  file: File;
  preview: string;
  loading: boolean;
  onRemove: (id: string) => void;
}

export function FileCard({
  id,
  file,
  preview,
  loading,
  onRemove,
}: FileCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Badge className="uppercase">{file.name.split(".").pop()}</Badge>
          {file.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <p className="text-sm text-muted-foreground">{preview}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
