import Link from "next/link"
import { register } from "@/features/auth/api/register"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  registerFormSchema,
  type RegisterFormSchemaType,
} from "@/lib/validations/auth"
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
      const decoded = await signup.json()
      if (!signup.ok) {
        throw new Error(decoded.error ?? "Something went wrong")
      }
      toast.success(`Verification email has been sent to ${data.email}`)
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 lg:w-1/2"
      >
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
              <FormDescription>Enter valid email to register</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Register
        </Button>
        <div className="flex gap-2 text-sm text-apple-800 md:text-base">
          Already have an account?{" "}
          <Link href={"/auth/login"} className="text-apple-600">
            Login
          </Link>
        </div>
      </form>
    </Form>
  )
}
