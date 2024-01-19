import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"

import type { ITransaction, ResponseById } from "@/types/api"

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
  console.log(props)
  return <div>TransactionDetailPage</div>
}

export default TransactionDetailPage
