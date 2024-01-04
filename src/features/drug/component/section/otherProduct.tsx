import React from "react"

import ProductCard from "@/features/drug/component/productCard/productCard"

function OtherProduct() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium text-primary">Other Product</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <ProductCard
          id={0}
          image="abc"
          price="5000"
          selling_unit="Bottle"
          name="Enervon B"
        />
        <ProductCard
          id={0}
          image="abc"
          price="5000"
          selling_unit="Bottle"
          name="Enervon B"
        />
        <ProductCard
          id={0}
          image="abc"
          price="5000"
          selling_unit="Bottle"
          name="Enervon B"
        />
        <ProductCard
          id={0}
          image="abc"
          price="5000"
          selling_unit="Bottle"
          name="Enervon B"
        />
      </div>
    </div>
  )
}

export default OtherProduct
