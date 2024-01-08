import React from "react"

import ResetPasswordLayout from "@/components/layouts/reset-password"
import ResetPasswordEmailForm from "@/features/resetpassword/component/form/resetPasswordEmailForm"

function PasswordPage() {
  return <ResetPasswordEmailForm />
}
PasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResetPasswordLayout>{page}</ResetPasswordLayout>
}
export default PasswordPage
