import React, { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, addYears, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import type { IProfileUser, ResponseById } from "@/types/api"
import { cn } from "@/lib/utils"
import {
  userProfileFormSchema,
  type UserProfileFormSchemaType,
} from "@/lib/validations/profile"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { imageLoader } from "@/components/image-loader"
import { updateProfile } from "@/features/profile/api/updateProfile"

function ProfileForm({ userProfile }: { userProfile?: IProfileUser }) {
  const { data: session, update } = useSession()
  const minOffset = 0,
    maxOffset = 20
  const thisYear = new Date().getFullYear()
  const allYears = []
  for (let x = minOffset; x <= maxOffset; x++) {
    allYears.push(thisYear - x)
  }
  const yearFilter = allYears.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }))
  const form = useForm<UserProfileFormSchemaType>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: userProfile?.name,
      date: userProfile?.date_of_birth
        ? format(userProfile?.date_of_birth, "yyyy-MM-dd")
        : format(new Date("2000-1-1"), "yyyy-MM-dd"),
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
          <Image
            width={160}
            height={160}
            alt="Man"
            loader={imageLoader}
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
            <FormItem className="flex flex-col">
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="z-4 mr-2" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={new Date(field.value)}
                      initialFocus
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown-buttons"
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }}
                      fromYear={1960}
                      toYear={2030}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
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
