import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"

import type { ITransactionConfirmation, ResponseById } from "@/types/api"
import { PAYMENT_STATUS } from "@/config"
import { MainLayout } from "@/components/layouts/main"
import TransacrionConfirmationSection from "@/features/order/components/section/transaction-confirmation"

export const getServerSideProps: GetServerSideProps<{
  props: ITransactionConfirmation
}> = async (context) => {
  const session = await getSession(context)

  const url =
    process.env.NEXT_PUBLIC_DB_URL +
    `/v1/transactions/${context.query.transactionId}/total-payment`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
    },
  })
  const decode: ResponseById<ITransactionConfirmation> = await res.json()
  if (
    decode.data.transaction_status_id !== PAYMENT_STATUS.UNPAID &&
    decode.data.transaction_status_id !== PAYMENT_STATUS.PAYMENT_REJECTED
  ) {
    return {
      notFound: true,
    }
  }
  if (!res.ok || decode.data === null) {
    return {
      redirect: {
        destination: `/order/transaction-detail/${context.query.transactionId}`,
        permanent: false,
      },
    }
  }
  const props = decode.data
  return {
    props: {
      props,
    },
  }
}

function TransactionConfirmationPage({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 py-6">
      <TransacrionConfirmationSection {...props} />
    </div>
  )
}

TransactionConfirmationPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <MainLayout>{page}</MainLayout>
}

export default TransactionConfirmationPage
