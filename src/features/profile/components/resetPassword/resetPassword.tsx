import React from "react"

import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function ResetPassword() {
  return (
    <>
      <div className="mt-10 space-y-1">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Send reset password request to email</CardDescription>
      </div>
      <Separator className="my-4" />
      <Button type="button" variant={"destructive"}>
        Reset Password
      </Button>
    </>
  )
}

export default ResetPassword
