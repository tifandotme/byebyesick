import React, { useEffect } from "react"
import { SearchIcon } from "lucide-react"

import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"

function Search({
  setValue,
}: {
  setValue: React.Dispatch<React.SetStateAction<string>>
}) {
  const [query, setQuery] = React.useState("")
  const debounceQuery = useDebounce(query, 500)
  useEffect(() => {
    setValue(debounceQuery)
  }, [debounceQuery, setValue])
  return (
    <div className="relative">
      <div className="absolute flex h-full w-10 items-center justify-center">
        <SearchIcon className="size-4 text-gray-500" />
      </div>
      <Input
        value={query}
        className="ps-10"
        placeholder="Search Product..."
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
    </div>
  )
}

export default Search
