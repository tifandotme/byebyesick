import React from "react"
import { toast } from "sonner"

import type { IProfileDoctor, IProfileUser } from "@/types/api"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { forgetPassword } from "@/features/resetpassword/api/forgetPassword"

function ResetPassword(props: IProfileUser | IProfileDoctor) {
  const resetPassword = async () => {
    try {
      const resp = await forgetPassword(props.email)
      if (!resp.ok) {
        throw new Error("Failed to send reset email")
      }
      toast.success("Reset email has sent")
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }
  return (
    <>
      <div className="mt-10 space-y-1">
        <CardTitle className="text-lg md:text-2xl">Reset Password</CardTitle>
        <CardDescription className="text-xs md:text-base">
          Send reset password request to email
        </CardDescription>
      </div>
      <Separator className="my-4" />
      <Button
        type="button"
        onClick={() => {
          resetPassword()
        }}
        variant={"destructive"}
      >
        Reset Password
      </Button>
    </>
  )
}

export default ResetPassword
