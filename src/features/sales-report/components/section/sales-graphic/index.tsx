import React from "react"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import type { IPharmacySalesReportByMonth, ResponseGetAll } from "@/types/api"
import { PHARMACY_ADMIN_ROLE } from "@/config"
import ChartLoader from "@/components/chart/chartLoader"
import LineChart from "@/components/chart/lineChart"
import YearComboBox from "@/features/pharmacies/components/comboboxes/year"

import Search from "../../search/search"

function SalesGraphicSection() {
  const { data: session } = useSession()
  const [year, setYear] = React.useState(new Date().getFullYear().toString())
  const [product, setProduct] = React.useState("")
  const { data, isLoading } = useSWR<
    ResponseGetAll<IPharmacySalesReportByMonth[]>
  >(() => {
    const params = new URLSearchParams()
    if (year) params.set("year", year)
    if (product) params.set("search", product)
    if (session?.user.user_role_id === PHARMACY_ADMIN_ROLE)
      return `/v1/reports/sells/monthly/pharmacy-admin?${params.toString()}`
    else return `/v1/reports/sells/monthly?${params.toString()}`
  })
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

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-4 p-1 xs:flex-row xs:items-center xs:justify-between">
        <h3 className="text-2xl font-bold capitalize leading-10 tracking-tight">
          {`Revenue (${product ? product : "All Product"})`}
        </h3>
        <div className="flex gap-2">
          <Search setValue={setProduct} />
          <YearComboBox value={year} setValue={setYear} />
        </div>
      </div>
      <div>
        {isLoading ? (
          <ChartLoader />
        ) : (
          data && (
            <LineChart
              data={mapData(data?.data.items)}
              name="Sales per Month"
              title={"Revenue"}
              labels={monthList}
            />
          )
        )}
      </div>
    </div>
  )
}

export default SalesGraphicSection
