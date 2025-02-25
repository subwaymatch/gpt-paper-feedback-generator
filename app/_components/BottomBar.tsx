import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";

interface BottomBarProps {
  filesCount: number;
  onReset: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function BottomBar({
  filesCount,
  onReset,
  onSubmit,
  isSubmitting,
}: BottomBarProps) {
  return (
    <div className="fixed bottom-0 right-0 lg:w-1/2 bg-slate-100 border-t border-slate-200 p-4">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filesCount} file{filesCount === 1 ? "" : "s"} selected
        </p>
        <div className="flex gap-4">
          <AlertDialog>
            {/* ... existing alert dialog content ... */}
          </AlertDialog>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
