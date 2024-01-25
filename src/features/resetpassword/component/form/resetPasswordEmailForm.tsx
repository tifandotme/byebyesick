import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { ResetPasswordEmailSchemeType } from "@/types"
import { resetPasswordEmailScheme } from "@/lib/validations/reset-password"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { forgetPassword } from "@/features/resetpassword/api/forgetPassword"

function ResetPasswordEmailForm() {
  const form = useForm<ResetPasswordEmailSchemeType>({
    resolver: zodResolver(resetPasswordEmailScheme),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<ResetPasswordEmailSchemeType> = async (
    data,
  ) => {
    try {
      const result = await forgetPassword(data.email)
      if (!result?.ok) {
        throw new Error("Failed to send email")
      }
      toast.success("Verification Email Sent", { duration: 2000 })
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
  }

  return (
    <div className="grid w-full max-w-lg items-center gap-8 pb-8 pt-6 md:py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter a valid email to send a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@mail.com"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <Link
              href="/auth/login"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ResetPasswordEmailForm
