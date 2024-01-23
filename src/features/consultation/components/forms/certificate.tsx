import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { CertificateInputs } from "@/types"
import type { SickLeaveForm } from "@/types/api"
import { updateCertificate } from "@/lib/fetchers"
import { cn, formatDate } from "@/lib/utils"
import { certificateSchema } from "@/lib/validations/consultation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

interface CertificateFormProps {
  mode: "add" | "edit"
  initialData?: Omit<SickLeaveForm, "prescription" | "user" | "doctor">
  onFormSubmit: () => void
  sessionId: number
}

export function CertificateForm({
  mode,
  initialData,
  onFormSubmit,
  sessionId,
}: CertificateFormProps) {
  const form = useForm<CertificateInputs>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      description: initialData?.description ?? "",
      starting_date: initialData
        ? format(initialData.starting_date, "yyyy-MM-dd")
        : "",
      ending_date: initialData
        ? format(initialData.ending_date, "yyyy-MM-dd")
        : "",
    },
  })

  const onSubmit = (data: CertificateInputs) => {
    const handleSubmission = async () => {
      const { success, message } = await updateCertificate(
        mode,
        {
          session_id: sessionId,
          ...data,
        },
        sessionId,
      )
      if (!success) throw new Error(message)

      form.reset()
      onFormSubmit()

      return message
    }

    toast.promise(handleSubmission(), {
      loading: "Updating sick leave certificate...",
      success: (message) => message,
      error: (err) => err.message,
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="starting_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Starting date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      form.setValue("ending_date", "")
                    }}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ending_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ending date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={!form.getValues("starting_date")}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }}
                    disabled={(date) =>
                      date <= new Date(form.getValues("starting_date")) ||
                      date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...field}
                className="w-full p-3"
                placeholder="Information to back up the certificate"
                rows={4}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
