import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

interface PdfPreviewProps
  extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {
  src: string
}

export function PdfPreview({ src, ...props }: PdfPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger
        {...props}
        className={cn(
          "flex size-[200px] flex-col items-center justify-center",
          props.className,
        )}
      >
        <Icons.Pdf className="size-16" />
        <span className="select-none text-sm">Click to preview</span>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Document</DialogTitle>
        </DialogHeader>
        <iframe src={src} className="h-[80vh] w-full" title="Attached PDF" />
      </DialogContent>
    </Dialog>
  )
}
