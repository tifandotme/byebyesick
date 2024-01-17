import React from "react"
import Head from "next/head"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useAdressList } from "@/lib/fetchers"
import MainLayout from "@/components/layout/main-layout"
import AddressModal from "@/features/profile/components/addressModal/addressModal"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"
import UserAddressList from "@/features/profile/components/userAddressList/userAddressList"

function AddressPage() {
  const { addressList, addressError, addressIsLoading } = useAdressList()

  return (
    <ProfileLayout
      title="My Address"
      desc="User Address Management"
      action={
        <AddressModal
          title="New Address"
          trigger={
            <div className="flex items-center justify-center gap-1 text-xs md:text-base">
              <PlusIcon className="size-5" />
              New Address
            </div>
          }
        />
      }
    >
      <Head>
        <title>ByeByeSick | Address</title>
      </Head>
      {addressError && toast.error("Error fetching address")}
      <UserAddressList
        addresses={addressList?.data.items}
        isLoading={addressIsLoading}
      />
    </ProfileLayout>
  )
}

AddressPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default AddressPage
