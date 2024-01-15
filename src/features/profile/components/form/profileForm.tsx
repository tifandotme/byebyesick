import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { IProfileUser, ResponseById } from "@/types/api"
import {
  userProfileFormSchema,
  type UserProfileFormSchemaType,
} from "@/lib/validations/profile"
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
import { updateProfile } from "@/features/profile/api/updateProfile"

function ProfileForm({ userProfile }: { userProfile?: IProfileUser }) {
  const { data: session, update } = useSession()
  const form = useForm<UserProfileFormSchemaType>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: userProfile?.name,
      date: userProfile?.date_of_birth,
    },
  })

  const [image, setImage] = useState<{
    image: File
    url: string
  }>()

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const file = files[0]
    if (!file) return
    setImage({
      url: URL.createObjectURL(file),
      image: file,
    })
  }

  const onSubmit: SubmitHandler<UserProfileFormSchemaType> = async (data) => {
    try {
      const result = await updateProfile(
        {
          date_of_birth: data.date,
          name: data.name,
        },
        image?.image,
      )
      if (!result?.ok) {
        throw new Error(result.statusText)
      }
      const userData: ResponseById<IProfileUser> = await result.json()

      await update({
        ...session,
        user: {
          ...session?.user,
          ...userData.data,
          image: userData.data.profile_photo,
        },
      })
      toast.success("Success Update Profile", { duration: 2000 })
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <label htmlFor="profile" className="self-center ">
          <img
            alt="Man"
            src={
              image?.url ??
              userProfile?.profile_photo ??
              "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
            }
            className="h-40 w-40 rounded-full object-cover"
          />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            id="profile"
            onChange={handleChangeImage}
          />
        </label>
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} min="1945-01-01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <Button type="submit" variant={"default"}>
            Edit Profile
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfileForm
