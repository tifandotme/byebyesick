/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { UploadCloudIcon } from "lucide-react"
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
import { SpecializationCombobox } from "../combobox/specialization"

function DoctorProfileForm({ userProfile }: { userProfile?: IProfileDoctor }) {
  const { data: session, update } = useSession()
  const form = useForm<DoctorProfileFormSchemaType>({
    resolver: zodResolver(doctorProfileFormSchema),
    defaultValues: {
      name: userProfile?.name,
      starting_year: userProfile?.starting_year,
      consultation_fee: userProfile?.consultation_fee,
      doctor_specialization_id:
        userProfile?.doctor_specialization.id?.toString() ?? "0",
    },
  })
  const [image, setImage] = useState<{
    image: File
    url: string
  }>()

  const [certificate, setCertificate] = useState<{
    file: File
    url: string
  }>()

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    const temp = URL.createObjectURL(file)
    if (file.size > 500000) {
      toast.error("File size must be less than 500Kb")
      return
    }
    setImage({
      url: temp,
      image: file,
    })
  }

  const handleChangeCertificate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    const temp = URL.createObjectURL(file)
    if (file.size > 500000) {
      toast.error("File size must be less than 500Kb")
      return
    }
    setCertificate({
      url: temp,
      file: file,
    })
  }

  const onSubmit: SubmitHandler<DoctorProfileFormSchemaType> = async (data) => {
    try {
      const result = await doctorUpdateProfile(
        {
          name: data.name,
          starting_year: data.starting_year,
          consultation_fee: data.consultation_fee,
          doctor_specialization: {
            id: parseInt(data.doctor_specialization_id),
            image: "",
            name: "",
          },
        },
        image?.image,
        certificate?.file,
      )
      if (!result?.ok) {
        throw new Error("Something went wrong")
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
        <label
          htmlFor="profile"
          className="flex cursor-pointer flex-col items-center gap-2 self-center"
        >
          <Image
            width={160}
            height={160}
            alt="Man"
            src={
              image?.url ||
              userProfile?.profile_photo ||
              "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
            }
            className="size-40 rounded-full object-cover"
          />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            id="profile"
            onChange={handleChangeImage}
          />
          <div className="text-blue-500">Change Profile</div>
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
          name="doctor_specialization_id"
          render={({ field }) => (
            <SpecializationCombobox
              label="Specialization"
              value={field.value}
              onValueChange={(value) =>
                form.setValue("doctor_specialization_id", value)
              }
            />
          )}
        />
        <div className="flex flex-col gap-4">
          <FormLabel>Certificate</FormLabel>
          {certificate ? (
            <Button
              type="button"
              onClick={() => {
                fetch(certificate.url)
                  .then((res) => res.blob())
                  .then((blob) => {
                    var file = window.URL.createObjectURL(blob)
                    window.open(file)
                  })
              }}
            >
              View Certificate
            </Button>
          ) : (
            userProfile?.doctor_certificate && (
              <Link
                href={userProfile?.doctor_certificate}
                className="w-full rounded-md border p-2 text-center"
                target="_blank"
              >
                View Certificate
              </Link>
            )
          )}
          <label htmlFor="certificate" className="w-full">
            <Button
              variant="outline"
              className="w-full cursor-pointer font-medium"
              asChild
            >
              <div>
                <UploadCloudIcon className="mr-1.5 size-3.5 translate-y-[-1px] stroke-foreground stroke-[0.6px]" />
                {userProfile?.doctor_certificate
                  ? "Change Certificate"
                  : "Upload Certificate"}
              </div>
            </Button>
          </label>
          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpg,image/jpeg,application/pdf"
            id="certificate"
            onChange={handleChangeCertificate}
          />
        </div>
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
