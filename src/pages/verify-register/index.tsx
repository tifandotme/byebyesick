import { type ReactElement } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"

import type { RegisterToken } from "@/types/user"
import VerifyForm from "@/features/auth/components/form/verifyForm"
import AuthLayout from "@/features/auth/components/layout/layout"

export const getServerSideProps = (async (context) => {
  const token = context?.query?.token

  const url =
    process.env.NEXT_PUBLIC_DB_URL + `/v1/auth/verify-register?token=${token}`
  try {
    const verify = await fetch(url)

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
