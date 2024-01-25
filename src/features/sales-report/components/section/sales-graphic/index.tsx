import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import type {
  IPharmacySalesReportByMonth,
  IProduct,
  ResponseGetAll,
} from "@/types/api"
import { PHARMACY_ADMIN_ROLE } from "@/config"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import ChartLoader from "@/components/chart/chartLoader"
import LineChart from "@/components/chart/lineChart"
import YearComboBox from "@/features/pharmacies/components/comboboxes/year"

import { ProductSelectTable } from "../product-select-table/product-select-table"

function SalesGraphicSection() {
  const { data: session } = useSession()
  const [year, setYear] = React.useState(new Date().getFullYear().toString())
  const router = useRouter()
  const {
    page,
    per_page,
    product_id,
    product_name,
    search,
    sort,
    drug_class,
    not_added,
  } = router.query

  const { data, isLoading } = useSWR<
    ResponseGetAll<IPharmacySalesReportByMonth[]>
  >(() => {
    const params = new URLSearchParams()
    if (year) params.set("year", year)
    if (product_id) params.set("product_id", product_id)
    if (session?.user.user_role_id === PHARMACY_ADMIN_ROLE)
      return `/v1/reports/sells/monthly/pharmacy-admin?${params.toString()}`
    else return `/v1/reports/sells/monthly?${params.toString()}`
  })
  const month = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const monthList = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Agustus",
    "September",
    "October",
    "November",
    "December",
  ]

  const mapData = (data: IPharmacySalesReportByMonth[]) => {
    const output = [0]
    const map = data.map((data) => data.total_sell)
    return output.concat(map)
  }

  const { data: productData, isLoading: productIsloading } = useSWR<
    ResponseGetAll<IProduct[]>
  >(() => {
    const params = new URLSearchParams()
    if (per_page) params.set("limit", per_page)
    if (search) params.set("search", search)
    if (page) params.set("page", page)
    if (drug_class) params.set("drug_class", drug_class)
    if (sort) params.set("sort_by", sort.split(".")[0] as string)
    if (sort) params.set("sort", sort.split(".")[1] as string)
    if (not_added) params.set("not_added", not_added)

    return `/v1/products/global?${params.toString()}`
  })

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-4 p-1 xs:flex-row xs:items-center xs:justify-between">
        <h3 className="text-2xl font-bold capitalize leading-10 tracking-tight">
          {`Revenue (${product_name ? product_name : "All Product"})`}
        </h3>
        <div className="flex gap-2">
          <YearComboBox value={year} setValue={setYear} />
        </div>
      </div>
      <div>
        {isLoading ? (
          <ChartLoader />
        ) : (
          data && (
            <LineChart
              data={
                currentYear === Number(year)
                  ? mapData(data?.data.items).slice(0, month + 1)
                  : mapData(data.data.items)
              }
              name="Sales per Month"
              title={"Revenue"}
              labels={monthList}
            />
          )
        )}
      </div>
      <div className="space-y-6 overflow-auto">
        <div className="text-2xl font-semibold">Select by Product</div>
        {productIsloading && !data && (
          <DataTableSkeleton columnCount={5} filterableFieldCount={0} />
        )}

        {productData && (
          <ProductSelectTable
            data={productData.data.items}
            pageCount={productData.data.total_pages}
          />
        )}
      </div>
    </div>
  )
}

export default SalesGraphicSection
