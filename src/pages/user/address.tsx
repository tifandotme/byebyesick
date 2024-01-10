import React from "react"
import { PlusIcon } from "lucide-react"

import type { AddressI } from "@/types/api"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layout/main-layout"
import AddressModal from "@/features/profile/components/addressModal/addressModal"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"
import UserAddressList from "@/features/profile/components/userAddressList/userAddressList"

function AddressPage() {
  const addressList: AddressI[] = [
    {
      id: 1,
      name: "Alamat Utama",
      address: "Jalan ABC, No 9, Jakarta Selatan",
      city: "Jakarta Selatan",
      district: "Mampang Prapatan",
      latitude: "-6",
      longitude: "10",
      province: "DKI Jakarta",
      postal_code: "83232",
      sub_district: "Mampang",
    },
  ]
  return (
    <ProfileLayout
      title="My Address"
      desc="User Address Management"
      action={
        <AddressModal
          title="New Address"
          trigger={
            <Button type="button" variant={"ghost"} className="flex gap-1">
              {" "}
              <span>
                <PlusIcon />
              </span>
              New Address
            </Button>
          }
        />
      }
    >
      <UserAddressList addresses={addressList} />
    </ProfileLayout>
  )
}

AddressPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default AddressPage
