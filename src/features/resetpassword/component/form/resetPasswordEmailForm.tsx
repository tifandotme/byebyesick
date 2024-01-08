import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { ResetPasswordEmailSchemeType } from "@/types"
import { resetPasswordEmailScheme } from "@/lib/validations/reset-password"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function ResetPasswordEmailForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm<ResetPasswordEmailSchemeType>({
    resolver: zodResolver(resetPasswordEmailScheme),
  })

  const onSubmit = async () => {
    setIsLoading(true)

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 "
      >
        <h1 className="text-xl font-medium">Reset Password</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter valid email to send verification link
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ResetPasswordEmailForm
