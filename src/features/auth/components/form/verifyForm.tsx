import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { RegisterToken } from "@/types/user"
import {
  verifyFormSchema,
  type VerifyFormSchemaType,
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

function VerifyForm({ data }: RegisterToken) {
  const form = useForm<VerifyFormSchemaType>({
    resolver: zodResolver(verifyFormSchema),
  })

  const onSubmit: SubmitHandler<VerifyFormSchemaType> = async (data) => {
    try {
      // const result = await signIn("credentials", { redirect: false, password: data.password, email: data.email })
      // if (!result?.ok) {
      //     throw new Error("Invalid email or password")
      // }
      // toast.success("User Successfully Registered", { duration: 2000 })
      toast.success(JSON.stringify(data), { duration: 2000 })
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 lg:w-1/2"
      >
        <div className="flex flex-col"></div>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default VerifyForm
