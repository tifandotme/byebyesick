import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  separated?: boolean
}

function PageHeader({
  className,
  children,
  as: Comp = "section",
  separated = false,
  ...props
}: PageHeaderProps) {
  return (
    <Comp className={cn("grid gap-1", className)} {...props}>
      {children}
      {separated && <Separator className="mt-2.5" />}
    </Comp>
  )
}

const headingVariants = cva(
  "font-extrabold leading-tight tracking-tighter lg:leading-[1.1]",
  {
    variants: {
      size: {
        default: "text-3xl md:text-4xl",
        sm: "text-2xl md:text-3xl",
        lg: "text-4xl md:text-5xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

interface PageHeaderHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

function PageHeaderHeading({
  className,
  size,
  as: Comp = "h2",
  ...props
}: PageHeaderHeadingProps) {
  return (
    <Comp className={cn(headingVariants({ size, className }))} {...props} />
  )
}

const descriptionVariants = cva("max-w-[750px] text-muted-foreground", {
  variants: {
    size: {
      default: "text-base sm:text-lg",
      sm: "text-sm sm:text-base",
      lg: "text-lg sm:text-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface PageHeaderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof descriptionVariants> {}

function PageHeaderDescription({
  children,
  className,
  size,
  ...props
}: PageHeaderDescriptionProps) {
  return (
    <p
      className={cn(descriptionVariants({ size, className }), "text-balance")}
      {...props}
    >
      {children}
    </p>
  )
}

export { PageHeader, PageHeaderDescription, PageHeaderHeading }
