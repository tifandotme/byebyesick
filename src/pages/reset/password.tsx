import React from "react"

import ResetPasswordEmailForm from "@/features/resetpassword/component/form/resetPasswordEmailForm"
import ResetPasswordLayout from "@/features/resetpassword/component/layout/reset-password"

function PasswordPage() {
  return <ResetPasswordEmailForm />
}
PasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResetPasswordLayout>{page}</ResetPasswordLayout>
}
export default PasswordPage
