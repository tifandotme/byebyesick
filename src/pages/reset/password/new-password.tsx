import React from "react"

import ResetPasswordForm from "@/features/resetpassword/component/form/resetPasswordForm"
import ResetPasswordLayout from "@/features/resetpassword/component/layout/reset-password"

function NewPasswordPage() {
  return <ResetPasswordForm />
}

NewPasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResetPasswordLayout>{page}</ResetPasswordLayout>
}

export default NewPasswordPage
