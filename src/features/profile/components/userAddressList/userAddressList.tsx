import React from "react"

import type { AddressI } from "@/types/api"
import UserAddress from "@/features/profile/components/userAddress/userAddress"

function UserAddressList({ addresses }: { addresses: AddressI[] }) {
  return addresses.map((address) => (
    <div key={address.name}>
      <UserAddress {...address} />
    </div>
  ))
}

export default UserAddressList
