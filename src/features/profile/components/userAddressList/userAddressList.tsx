import React from "react"

import type { AddressIForm } from "@/types/api"
import UserAddress from "@/features/profile/components/userAddress/userAddress"

import AddressSkeleton from "../userAddress/addressSkeleton"

function UserAddressList({
  addresses,
  isLoading,
}: {
  addresses: AddressIForm[] | undefined
  isLoading: boolean
}) {
  return isLoading ? (
    <AddressSkeleton />
  ) : (
    addresses &&
      addresses.map((address) => (
        <div key={address.name}>
          <UserAddress {...address} />
        </div>
      ))
  )
}

export default UserAddressList
