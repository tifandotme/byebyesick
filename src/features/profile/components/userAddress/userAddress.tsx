import React from "react"

import type { AddressI } from "@/types/api"
import { Button } from "@/components/ui/button"
import AddressModal from "@/features/profile/components/addressModal/addressModal"

function UserAddress(address: AddressI) {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <h2 className="text-sm md:text-base">{address.name}</h2>
        </div>
        <div className="max-w-44 text-xs text-muted-foreground md:max-w-96 md:text-sm">
          {address.address}
        </div>
        <div className="w-fit rounded-sm border-2 border-accent px-2 py-1 text-xs text-muted-foreground md:text-sm">
          main
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AddressModal
          title={"Edit Address"}
          trigger={
            <div className="flex items-center justify-center gap-1 text-xs md:text-base">
              Edit
            </div>
          }
          address={address}
        />
        <Button variant={"destructive"} size={"sm"}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default UserAddress
