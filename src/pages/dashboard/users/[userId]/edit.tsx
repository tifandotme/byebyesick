import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { ResponseById, User } from "@/types/api"
import { removeLastSegment } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UserForm } from "@/features/users/components/form"
import { UsersLayout } from "@/features/users/components/layout"

export const getServerSideProps: GetServerSideProps<{
  userId: string
}> = async (context) => {
  const userId = context.params?.userId as string | undefined

  if (!userId || isNaN(Number(userId))) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      userId,
    },
  }
}

export default function EditUserPage({
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { data, isLoading } = useSWR<ResponseById<User>>(
    `/v1/users/${userId}`,
    {
      onError: () => {
        router.push(removeLastSegment(router.asPath, 2))
      },
    },
  )

  return (
    <>
      {isLoading && <UserFormSkeleton />}
      {data && (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Edit user</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm mode="edit" initialData={data.data} />
          </CardContent>
        </Card>
      )}
    </>
  )
}

function UserFormSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <Skeleton className="h-8 w-1/5" />
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-2xl gap-5">
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[218px]" />
          </div>
          <div className="flex gap-2">
            <div className="w-full space-y-2.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10" />
            </div>
            <div className="w-full space-y-2.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10" />
            </div>
          </div>
          <Skeleton className="h-[72px]" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  )
}

EditUserPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <UsersLayout>{page}</UsersLayout>
    </DashboardLayout>
  )
}
