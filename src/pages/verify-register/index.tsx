import React, { type ReactElement } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import VerifyForm from "@/features/auth/components/form/verifyForm"
import AuthLayout from "@/features/auth/components/layout/layout"

import type { RegisterToken } from "@/types/user"

export const getServerSideProps = (async (context) => {
  const token = context?.query?.token
  try {
    const verify = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/auth/verify-register?token=${token}`,
    )
    if (!verify.ok || verify.status === 400) {
      throw new Error("Invalid Token")
    }
    const props = await verify.json()
    return { props: { props } }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}) satisfies GetServerSideProps<{
  props: RegisterToken
}>

function VerifyPage({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>ByeByeSick | Verify Email</title>
      </Head>
      <VerifyForm {...props} />
    </>
  )
}

VerifyPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default VerifyPage

// http://localhost:8080/v1/auth/verify-register?token=4df68ae8-8cc4-4339-b197-b52ff7c057de
