import React from "react"
import Head from "next/head"
import { PlusIcon } from "lucide-react"

import type { AddressI } from "@/types/api"
import MainLayout from "@/components/layout/main-layout"
import AddressModal from "@/features/profile/components/addressModal/addressModal"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"
import UserAddressList from "@/features/profile/components/userAddressList/userAddressList"

function AddressPage() {
  const addressList: AddressI[] = [
    {
      name: "Alamat Utama",
      address: "Jalan ABC, No 9, Jakarta Selatan",
      district: "Mampang Prapatan",
      latitude: "-6",
      longitude: "10",
      postalCode: "83232",
      subDistrict: "Mampang",
      cityId: 1,
      provinceId: 1,
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
            <div className="flex items-center justify-center gap-1 text-xs md:text-base">
              <PlusIcon className="h-5 w-5" />
              New Address
            </div>
          }
        />
      }
    >
      <Head>
        <title>ByeByeSick | Address</title>
      </Head>
      <UserAddressList addresses={addressList} />
    </ProfileLayout>
  )
}

AddressPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default AddressPage
