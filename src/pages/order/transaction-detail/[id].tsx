import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"

import type { ApiResponse, ITransaction, ResponseById } from "@/types/api"

export const getStaticPaths: GetStaticPaths = async () => {
  const url = process.env.BASE_URL + "/v1/transactions"
  const res = await fetch(url)
  const transactions: ApiResponse<ITransaction[]> = await res.json()
  const paths = transactions.data.items.map((transaction) => ({
    params: { id: transaction.id.toString() },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<{
  transaction: ResponseById<ITransaction>
}> = async (context) => {
  const url = process.env.BASE_URL + `/v1/transactions/${context?.params?.id}`
  const res = await fetch(url)
  const transaction = (await res.json()) as
    | ResponseById<ITransaction>
    | undefined
  if (!transaction) {
    return {
      notFound: true,
    }
  }
  return {
    props: { transaction },
    revalidate: 10,
  }
}

function TransactionDetailPage() {
  return <div>TransactionDetailPage</div>
}

export default TransactionDetailPage
