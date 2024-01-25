import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { ApiResponse } from "@/types/api"
import type { RegisterToken, UserI } from "@/types/user"
import doctor from "@/assets/backgrounds/doctor.svg"
import patient from "@/assets/backgrounds/patient.svg"
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
import { imageLoader } from "@/components/image-loader"
import { verify } from "@/features/auth/api/verify"

function VerifyForm({ data }: RegisterToken) {
  const router = useRouter()

  const form = useForm<VerifyFormSchemaType>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      role: "",
      name: "",
      password: "",
      confirmPassword: "",
      image: undefined,
    },
  })

  const [isDoctor, setIsDoctor] = React.useState<boolean>(false)

  const onSubmit: SubmitHandler<VerifyFormSchemaType> = async (formData) => {
    try {
      const signup = await verify(
        {
          ...formData,
          email: data,
        },
        router.query.token,
      )
      const decoded: ApiResponse<UserI> = await signup.json()
      if (!signup.ok) {
        throw new Error(decoded.errors[0] ?? "Something went wrong")
      }
      toast.success("Account successfully registred", { duration: 1000 })
      router.replace("/auth/login")
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
  }

  console.log("image watch", form.watch("image"))
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-xl">
          Welcome{" "}
          <span className="text-3xl font-medium text-primary">{data}</span>
        </div>
        <div>
          <FormLabel>Register as</FormLabel>
          <FormField
            control={form.control}
            name="role"
            render={() => (
              <FormItem>
                <FormControl>
                  <fieldset className="grid grid-cols-2 place-content-center gap-4 p-2">
                    <legend className="sr-only">Role</legend>
                    <div>
                      <input
                        type="radio"
                        value="3"
                        onClick={() => {
                          setIsDoctor(true)
                        }}
                        {...form.register("role")}
                        id="doctor"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="doctor"
                        className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary"
                      >
                        <Image
                          src={doctor}
                          alt="doctor"
                          className="container h-20 object-fill"
                          width={200}
                          height={200}
                        />
                        <p className="mt-1 text-gray-900">Doctor</p>
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="4"
                        onClick={() => {
                          setIsDoctor(false)
                          form.setValue("image", undefined)
                        }}
                        {...form.register("role")}
                        id="patient"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="patient"
                        className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary"
                      >
                        <Image
                          src={patient}
                          alt="patient"
                          className="container h-20 object-contain"
                          width={200}
                          loader={imageLoader}
                          height={200}
                        />
                        <p className="mt-1 text-gray-900">Patient</p>
                      </label>
                    </div>
                  </fieldset>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" type="text" {...field} />
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
        {isDoctor && (
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Certificate</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return

                      const file = files[0]
                      if (!file) return

                      field.onChange(file)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default VerifyForm
