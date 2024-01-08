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
    },
  })

  const { data: session } = useSession()
  useEffect(() => {
    const callbackUrl = router.query.callbackUrl as string
    if (session) {
      if (callbackUrl) {
        router.replace(callbackUrl)
      }
      switch (session.user.user_role_id) {
        case 1:
          router.replace("/dashboard/products")
          break
        case 2:
          router.replace("/dashboard/pharmacies")
          break
        case 3:
          router.replace("/")
          break
        case 4:
          router.replace("/")
          break
      }
    }
  }, [session, router])

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
      toast.success("Login Successfull", { duration: 2000 })
      router.replace("/")
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@mail.com" {...field} />
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
        <Button className="w-full" type="submit">
          Login
        </Button>
        <div className="flex justify-between text-sm md:text-base">
          <div className="flex gap-2">
            Don&apos;t have an account?{" "}
            <Link href={"/auth/register"} className="text-apple-600">
              Register
            </Link>
          </div>
          <Link href={"/reset/password"} className="text-apple-600">
            Reset Password
          </Link>
        </div>
      </form>
    </Form>
  )
}
