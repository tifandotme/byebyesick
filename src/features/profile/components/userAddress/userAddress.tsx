import React from "react"

import type { AddressI } from "@/types/api"
import { Button } from "@/components/ui/button"
import AddressModal from "@/features/profile/components/addressModal/addressModal"

function UserAddress(address: AddressI) {
  return (
    <div className="flex w-full flex-row justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <h2>{address.name}</h2>|<h3>{address.city}</h3>
        </div>
        <div className="text-gray-500">{address.address}</div>
      </div>
      <div className="flex items-center gap-2">
        <AddressModal
          title={"Edit Address"}
          trigger={<Button type="button">Edit</Button>}
          address={address}
        />
        <Button variant={"destructive"}>Delete</Button>
      </div>
    </div>
  )
}

export default UserAddress
