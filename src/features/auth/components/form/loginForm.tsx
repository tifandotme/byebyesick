import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from "next-auth/react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import {
  loginFormSchema,
  type LoginFormSchemaType,
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

export default function LoginForm() {
  const router = useRouter()
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { data: session } = useSession()
  useEffect(() => {
    if (!session) return

    const callbackUrl = router.query.callbackUrl as string
    if (callbackUrl) {
      router.replace(callbackUrl)
      return
    }

    switch (session.user.user_role_id) {
      case 1:
        router.replace("/dashboard/products")
        break
      case 2:
        router.replace("/dashboard/pharmacies")
        break
      case 3:
        router.replace("/doctor")
        break
      case 4:
        router.replace("/")
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const onSubmit: SubmitHandler<LoginFormSchemaType> = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        password: data.password,
        email: data.email,
      })
      if (!result?.ok) {
        throw new Error("Invalid email or password")
      }
      toast.success("Login Successful", { duration: 2000 })
      router.replace("/")
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
  }

  return (
    <div className="grid w-full max-w-md items-center gap-8 pb-8 pt-6 md:py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
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
                        type="text"
                        placeholder="johndoe@mail.com"
                        {...field}
                      />
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
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span className="mr-1 hidden sm:inline-block">
              Don&apos;t have an account?
            </span>
            <Link
              href="/auth/register"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
          <Link
            href="/reset/password"
            className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
          >
            Reset password
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
