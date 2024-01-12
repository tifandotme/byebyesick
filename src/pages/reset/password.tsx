import React from "react"
import Head from "next/head"

import ResetPasswordEmailForm from "@/features/resetpassword/component/form/resetPasswordEmailForm"
import ResetPasswordLayout from "@/features/resetpassword/component/layout/reset-password"

function PasswordPage() {
  return (
    <>
      <Head>
        <title>ByeByeSick | Forget Password</title>
      </Head>
      <ResetPasswordEmailForm />
    </>
  )
}
PasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResetPasswordLayout>{page}</ResetPasswordLayout>
}
export default PasswordPage
