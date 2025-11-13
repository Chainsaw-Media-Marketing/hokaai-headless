// GraphQL queries for Shopify Storefront API

export const COLLECTION_BY_HANDLE = `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: 48) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 40) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  weight
                  weightUnit
                  sku
                }
              }
            }
            meatType: metafield(namespace: "custom", key: "meat_type") {
              value
            }
            cutFamily: metafield(namespace: "custom", key: "cut_family") {
              value
            }
            occasion: metafield(namespace: "custom", key: "occasion") {
              value
            }
            department: metafield(namespace: "custom", key: "department") {
              value
            }
            bulkType: metafield(namespace: "custom", key: "bulk_type") {
              value
            }
            deliType: metafield(namespace: "custom", key: "deli_type") {
              value
            }
            pricePerKg: metafield(namespace: "custom", key: "price_per_kg") {
              value
            }
          }
        }
      }
    }
  }
`

export const PRODUCT_BY_HANDLE = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 40) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            weight
            weightUnit
            sku
          }
        }
      }
      meatType: metafield(namespace: "custom", key: "meat_type") {
        value
      }
      cutFamily: metafield(namespace: "custom", key: "cut_family") {
        value
      }
      occasion: metafield(namespace: "custom", key: "occasion") {
        value
      }
      department: metafield(namespace: "custom", key: "department") {
        value
      }
      bulkType: metafield(namespace: "custom", key: "bulk_type") {
        value
      }
      deliType: metafield(namespace: "custom", key: "deli_type") {
        value
      }
      pricePerKg: metafield(namespace: "custom", key: "price_per_kg") {
        value
      }
    }
  }
`

export const PRODUCTS_BY_TAGS = `
  query ProductsByTags($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 40) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                weight
                weightUnit
                sku
              }
            }
          }
          tags
          meatType: metafield(namespace: "custom", key: "meat_type") {
            value
          }
          cutFamily: metafield(namespace: "custom", key: "cut_family") {
            value
          }
          occasion: metafield(namespace: "custom", key: "occasion") {
            value
          }
          department: metafield(namespace: "custom", key: "department") {
            value
          }
          bulkType: metafield(namespace: "custom", key: "bulk_type") {
            value
          }
          deliType: metafield(namespace: "custom", key: "deli_type") {
            value
          }
          pricePerKg: metafield(namespace: "custom", key: "price_per_kg") {
            value
          }
          spiceFamily: metafield(namespace: "custom", key: "spice_family") {
            value
          }
          braaiGearFamily: metafield(namespace: "custom", key: "braai_gear_family") {
            value
          }
          groceryFamily: metafield(namespace: "custom", key: "grocery_family") {
            value
          }
        }
      }
    }
  }
`
