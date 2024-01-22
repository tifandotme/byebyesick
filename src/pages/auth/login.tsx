import React, { type ReactElement } from "react"
import Head from "next/head"

import LoginForm from "@/features/auth/components/form/loginForm"
import AuthLayout from "@/features/auth/components/layout/layout"

function LoginPage() {
  return (
    <>
      <Head>
        <title>ByeByeSick | Login</title>
      </Head>
      <LoginForm />
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default LoginPage
