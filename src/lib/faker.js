import fs from "node:fs"
import { faker } from "@faker-js/faker"

// Function to generate fake product data
const generateFakeProduct = (id) => ({
  id,
  name: `Product ${id}`,
  generic_name: `Product ${id}`,
  content: `Product ${id}`,
  manufacturer_id: faker.number.int({ min: 1, max: 5 }),
  description: `This is product ${id}`,
  drug_classification_id: faker.number.int({ min: 1, max: 3 }),
  product_category_id: faker.number.int({ min: 1, max: 5 }),
  drug_form: faker.lorem.word(),
  unit_in_pack: faker.number.int({ min: 1, max: 20 }).toString(),
  selling_unit: faker.lorem.word(),
  weight: faker.number.float({ min: 100, max: 1000 }),
  length: faker.number.float({ min: 10, max: 50 }),
  width: faker.number.float({ min: 10, max: 50 }),
  height: faker.number.float({ min: 10, max: 50 }),
  image: faker.image.urlPicsumPhotos(),
  price: faker.commerce.price({ min: 1000, max: 50000 }).toString(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
})

// Function to generate the desired JSON structure
const generateFakeData = () => {
  const totalItems = 10 // Change this based on your requirement
  const items = Array.from({ length: totalItems }, (_, index) =>
    generateFakeProduct(index + 1),
  )

  return {
    data: {
      total_items: totalItems,
      total_pages: 1,
      current_page_total_items: totalItems,
      current_page: 1,
      items,
    },
  }
}

// Save generated data as a JSON file
const jsonData = JSON.stringify(generateFakeData(), null, 2)
fs.writeFileSync("db.json", jsonData)

console.log("Fake data has been generated and saved to db.json")
