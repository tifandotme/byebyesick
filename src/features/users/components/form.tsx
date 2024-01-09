import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { PopoverClose } from "@radix-ui/react-popover"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { UserInputs } from "@/types"
import type { User } from "@/types/api"
import { deleteAdmin, updateAdmin } from "@/lib/fetchers"
import { toSentenceCase } from "@/lib/utils"
import { userSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

interface UserFormProps {
  mode: "add" | "edit"
  initialData?: User
}

export function UserForm({ mode, initialData }: UserFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<UserInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      password: "",
    },
  })

  const onSubmit = async (data: UserInputs) => {
    setIsLoading(true)

    const { success, message } = await updateAdmin(mode, data, initialData?.id)
    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)
  }

  React.useEffect(() => {
    form.setFocus("email")
  }, [form])

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="w-fit">
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {toSentenceCase(mode)} user
          </Button>
          {mode === "edit" && initialData && (
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="destructive" className="w-fit">
                  Delete
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-[250px] space-y-4 text-center">
                <span>Are you sure?</span>
                <div className="flex gap-2 [&>*]:w-full">
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        const handleDeletion = async () => {
                          const { success } = await deleteAdmin(initialData.id)

                          if (!success) throw new Error()

                          router.push("/dashboard/users")
                        }

                        toast.promise(handleDeletion(), {
                          loading: "Deleting admin...",
                          success: "Admin deleted successfully",
                          error: "Failed to delete admin",
                        })
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      Yes
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button size="sm" variant="secondary">
                      No
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </form>
    </Form>
  )
}
