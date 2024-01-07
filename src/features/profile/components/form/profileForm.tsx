import React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPinIcon, UserIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  verifyFormSchema,
  type VerifyFormSchemaType,
} from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@/components/ui/separator"

function ProfileForm() {
  const form = useForm<VerifyFormSchemaType>({
    resolver: zodResolver(verifyFormSchema),
  })

  return (
    <Form {...form}>
      <form className="flex w-full  flex-col space-y-6">
        <img
          alt="Man"
          src={`https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png`}
          className="h-40 w-40 self-center rounded-full object-cover"
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="******" type="text" {...field} />
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
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input placeholder="******" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <Button type="button" variant={"default"}>
            Edit Profile
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfileForm
