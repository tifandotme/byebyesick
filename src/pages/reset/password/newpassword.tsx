import React from "react"

import ResetPasswordLayout from "@/components/layouts/reset-password"
import ResetPasswordForm from "@/features/resetpassword/component/form/resetPasswordForm"

function NewPasswordPage() {
  return <ResetPasswordForm />
}

NewPasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResetPasswordLayout>{page}</ResetPasswordLayout>
}

export default NewPasswordPage
