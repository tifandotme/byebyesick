import React, { type ReactElement } from "react"
import Head from "next/head"
import RegisterForm from "@/features/auth/components/form/registerForm"
import AuthLayout from "@/features/auth/components/layout/layout"

function RegisterPage() {
  return (
    <>
      <Head>
        <title>ByeByeSick | Register</title>
      </Head>
      <RegisterForm />
    </>
  )
}

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default RegisterPage
