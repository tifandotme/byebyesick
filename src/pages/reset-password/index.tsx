import React from "react"
import type { GetServerSideProps } from "next"

import type { RegisterToken } from "@/types/user"
import ResetPasswordForm from "@/features/resetpassword/component/form/resetPasswordForm"
import ResetPasswordLayout from "@/features/resetpassword/component/layout/reset-password"

export const getServerSideProps = (async (context) => {
  const token = context?.query?.token
  const url =
    process.env.NEXT_PUBLIC_DB_URL + `/v1/auth/verify-forgot?token=${token}`
  try {
    const verify = await fetch(url)
    if (!verify.ok) {
      throw new Error("Invalid Token")
    }
    const props: RegisterToken = await verify.json()
    return { props: { props } }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}) satisfies GetServerSideProps<{
  props: RegisterToken
}>

function NewPasswordPage() {
  return <ResetPasswordForm />
}

NewPasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResetPasswordLayout>{page}</ResetPasswordLayout>
}

export default NewPasswordPage
