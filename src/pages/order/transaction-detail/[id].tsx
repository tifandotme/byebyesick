import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"

import type { ITransaction, ResponseById } from "@/types/api"
import { MainLayout } from "@/components/layouts/main"
import TransactionDetailSection from "@/features/order/components/section/transaction-detail-section"

export const getServerSideProps: GetServerSideProps<{
  props: ITransaction
}> = async (context) => {
  const session = await getSession(context)

  const url =
    process.env.NEXT_PUBLIC_DB_URL + `/v1/transactions/${context.query.id}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
    },
  })
  const decode: ResponseById<ITransaction> = await res.json()
  if (!res.ok || decode.data === null) {
    return {
      notFound: true,
    }
  }
  const props = decode.data
  return {
    props: {
      props,
    },
  }
}

function TransactionDetailPage({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log(props)
  return <TransactionDetailSection {...props} />
}

TransactionDetailPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default TransactionDetailPage
