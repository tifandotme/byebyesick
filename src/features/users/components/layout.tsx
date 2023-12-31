import { useRouter } from "next/router"
import { PlusIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export function UsersLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="relative">
        <PageHeaderHeading size="sm">Users</PageHeaderHeading>
        <PageHeaderDescription size="sm">Manage users</PageHeaderDescription>
        {router.pathname === "/dashboard/users" && (
          <div className="absolute right-1 top-3.5">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/users/add")}
            >
              <PlusIcon className="mr-1.5" /> Create admin
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </section>
  )
}
