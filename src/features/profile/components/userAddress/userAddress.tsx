import React from "react"
import { HomeIcon, MoreVerticalIcon } from "lucide-react"
import { toast } from "sonner"

import type { AddressIForm } from "@/types/api"
import { useAdressList } from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AddressModal from "@/features/profile/components/addressModal/addressModal"

import { deleteAddress } from "../../api/deleteAddress"
import { setMainAddress } from "../../api/setMainAddress"

function UserAddress(address: AddressIForm) {
  const { addressMutate } = useAdressList()
  const handleDeleteAddress = async () => {
    try {
      const resp = await deleteAddress(address.id)
      if (!resp.ok) {
        throw new Error("Failed to delete")
      }
      toast.success("Address Deleted")
      addressMutate()
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  const handleUpdateMainAddress = async () => {
    try {
      const resp = await setMainAddress(address.id)
      if (!resp.ok) {
        throw new Error("Failed to change main address")
      }
      toast.success("Success change main address")
      addressMutate()
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  return (
    <div className="mb-5 flex w-full flex-row items-center justify-between">
      <div className="flex gap-5">
        <Popover>
          <PopoverTrigger>
            <MoreVerticalIcon className="size-4" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-fit p-1">
            {address.status == 1 ? (
              <div className="flex rounded border p-2">Main address</div>
            ) : (
              <Button
                variant={"default"}
                size={"sm"}
                onClick={() => {
                  handleUpdateMainAddress()
                }}
              >
                <div className="flex items-center gap-2">
                  <HomeIcon />
                  Set as Main Address
                </div>
              </Button>
            )}
          </PopoverContent>
        </Popover>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-sm md:text-base">{address.name}</h2>
            {address.status === 1 && (
              <div className="w-fit rounded-sm border-2 border-accent px-2 py-1 text-xs text-muted-foreground md:text-sm">
                main
              </div>
            )}
          </div>
          <div className="max-w-44 text-xs text-muted-foreground md:max-w-96 md:text-sm">
            {address.address}
          </div>
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
        <Button
          variant={"destructive"}
          type="button"
          onClick={() => {
            handleDeleteAddress()
          }}
          size={"sm"}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default UserAddress
