import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { NewPasswordEmailSchemeType } from "@/types"
import { newPasswordScheme } from "@/lib/validations/reset-password"
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
import { resetPassword } from "@/features/resetpassword/api/resetPassword"

function ResetPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm<NewPasswordEmailSchemeType>({
    resolver: zodResolver(newPasswordScheme),
  })
  const onSubmit: SubmitHandler<NewPasswordEmailSchemeType> = async (data) => {
    setIsLoading(true)
    try {
      const token = router.query.token as string
      if (token) {
        const result = await resetPassword(data.password, token)
        if (!result?.ok) {
          throw new Error(result.statusText)
        }
        toast.success("Success Reset Password", { duration: 2000 })
        router.replace("/auth/login")
      }
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-6 "
      >
        <h1 className="text-xl font-medium">Set New Password</h1>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormDescription>
                Enter minimum 8 character for password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormDescription>Confirm your new Password</FormDescription>
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

export default ResetPasswordForm
