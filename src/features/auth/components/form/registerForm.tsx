import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  registerFormSchema,
  type RegisterFormSchemaType,
} from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { register } from "@/features/auth/api/register"

export default function RegisterForm() {
  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: RegisterFormSchemaType) {
    try {
      const signup = await register(data.email)
      if (!signup.ok) {
        switch (signup.status) {
          case 400:
            throw new Error("Email is already registered")
          default:
            throw new Error("Something went wrong")
        }
      }
      toast.success(`Verification email has been sent to ${data.email}`)
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  return (
    <div className="grid w-full max-w-md items-center gap-8 pb-8 pt-6 md:py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign up</CardTitle>
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
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span className="mr-1 hidden sm:inline-block">
              Already have an account?
            </span>
            <Link
              href="/auth/login"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
