import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { ResetPasswordEmailSchemeType } from "@/types"
import { resetPasswordEmailScheme } from "@/lib/validations/reset-password"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { forgetPassword } from "@/features/resetpassword/api/forgetPassword"

function ResetPasswordEmailForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm<ResetPasswordEmailSchemeType>({
    resolver: zodResolver(resetPasswordEmailScheme),
  })

  const onSubmit: SubmitHandler<ResetPasswordEmailSchemeType> = async (
    data,
  ) => {
    setIsLoading(true)
    try {
      const result = await forgetPassword(data.email)
      if (!result?.ok) {
        throw new Error("Failed to Send Email")
      }
      toast.success("Verification Email Sent", { duration: 2000 })
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-lg -translate-y-5 p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
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
    </Card>
  )
}

export default ResetPasswordEmailForm
