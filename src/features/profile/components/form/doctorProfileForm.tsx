import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { IProfileDoctor, ResponseById } from "@/types/api"
import {
  doctorProfileFormSchema,
  type DoctorProfileFormSchemaType,
} from "@/lib/validations/doctor-profile"
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

import { doctorUpdateProfile } from "../../api/doctorUpdateProfile"

function DoctorProfileForm({ userProfile }: { userProfile?: IProfileDoctor }) {
  const { data: session, update } = useSession()
  const form = useForm<DoctorProfileFormSchemaType>({
    resolver: zodResolver(doctorProfileFormSchema),
    defaultValues: {
      name: userProfile?.name,
      starting_year: userProfile?.starting_year,
      consultation_fee: userProfile?.consultation_fee,
      doctor_specialization_id: userProfile?.doctor_specialization,
      profile_photo: userProfile?.profile_photo,
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

  const onSubmit: SubmitHandler<DoctorProfileFormSchemaType> = async (data) => {
    try {
      const result = await doctorUpdateProfile(
        {
          name: data.name,
        },
        image?.image,
      )
      if (!result?.ok) {
        throw new Error(result.statusText)
      }
      const userData: ResponseById<IProfileDoctor> = await result.json()

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
              image?.url ||
              userProfile?.profile_photo ||
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
          name="consultation_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultation Fee</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starting_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Year</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Certificate</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" type="file" {...field} />
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

export default DoctorProfileForm
