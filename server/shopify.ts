/**
 * Server-side Shopify Storefront API integration
 * Handles all API communication securely without exposing tokens to the client
 */

const SHOPIFY_DOMAIN = "hfzgry-kp.myshopify.com"
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-10"

if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
  throw new Error("Missing required Shopify environment variables")
}

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`

/**
 * Execute a Storefront API GraphQL query
 */
export async function storefrontFetch<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("[Shopify] GraphQL errors:", json.errors)
      throw new Error(json.errors[0]?.message || "GraphQL query failed")
    }

    return json.data as T
  } catch (error) {
    console.error("[Shopify] Fetch error:", error)
    throw error
  }
}

/**
 * Cart response type
 */
export interface CartResponse {
  cartId: string
  checkoutUrl: string
  hasLines: boolean
  lineCount: number
  userErrors?: Array<{ field: string[]; message: string }>
}

/**
 * Create a new cart or return existing cart
 */
export async function ensureCart(existingId?: string): Promise<CartResponse> {
  // If we have an existing ID, try to fetch it first
  if (existingId) {
    try {
      const cart = await getCart(existingId)
      if (cart) {
        return cart
      }
    } catch (error) {
      console.log("[Shopify] Existing cart not found, creating new one")
    }
  }

  // Create new cart
  const mutation = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await storefrontFetch<{
    cartCreate: {
      cart: {
        id: string
        checkoutUrl: string
        lines: { edges: Array<{ node: { id: string } }> }
      }
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(mutation)

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  const cart = data.cartCreate.cart

  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    hasLines: cart.lines.edges.length > 0,
    lineCount: cart.lines.edges.length,
  }
}

/**
 * Add items to cart
 */
export async function addToCart(
  cartId: string,
  lines: Array<{
    merchandiseId: string
    quantity: number
    attributes?: Array<{ key: string; value: string }>
  }>,
): Promise<CartResponse & { userErrors?: Array<{ field: string[]; message: string }> }> {
  if (process.env.NODE_ENV === "development") {
    const linesWithAttrs = lines.filter((line) => line.attributes && line.attributes.length > 0)
    if (linesWithAttrs.length > 0) {
      console.log("[v0] Adding cart lines with attributes:", JSON.stringify(linesWithAttrs, null, 2))
    }
  }

  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: {
        id: string
        checkoutUrl: string
        lines: { edges: Array<{ node: { id: string } }> }
      }
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(mutation, {
    cartId,
    lines,
  })

  if (data.cartLinesAdd.userErrors.length > 0) {
    return {
      cartId,
      checkoutUrl: "",
      hasLines: false,
      lineCount: 0,
      userErrors: data.cartLinesAdd.userErrors,
    }
  }

  const cart = data.cartLinesAdd.cart

  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    hasLines: cart.lines.edges.length > 0,
    lineCount: cart.lines.edges.length,
  }
}

/**
 * Get cart details
 */
export async function getCart(cartId: string): Promise<CartResponse | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `

  try {
    const data = await storefrontFetch<{
      cart: {
        id: string
        checkoutUrl: string
        lines: { edges: Array<{ node: { id: string } }> }
      } | null
    }>(query, { cartId })

    if (!data.cart) {
      return null
    }

    return {
      cartId: data.cart.id,
      checkoutUrl: data.cart.checkoutUrl,
      hasLines: data.cart.lines.edges.length > 0,
      lineCount: data.cart.lines.edges.length,
    }
  } catch (error) {
    console.error("[Shopify] Error fetching cart:", error)
    return null
  }
}

/**
 * Create a new cart with initial lines
 */
export async function createCartWithLines(
  lines: Array<{
    merchandiseId: string
    quantity: number
    attributes?: Array<{ key: string; value: string }>
  }>,
): Promise<any> {
  const mutation = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                    product {
                      handle
                      title
                    }
                    weight
                    weightUnit
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await storefrontFetch<{
    cartCreate: {
      cart: any
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(mutation, { lines })

  if (data.cartCreate.userErrors.length > 0) {
    console.error("[Shopify] createCartWithLines userErrors:", data.cartCreate.userErrors)
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return data.cartCreate.cart
}

/**
 * Add lines to existing cart and return full cart object
 */
export async function addLinesToCart(
  cartId: string,
  lines: Array<{
    merchandiseId: string
    quantity: number
    attributes?: Array<{ key: string; value: string }>
  }>,
): Promise<any> {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                    product {
                      handle
                      title
                    }
                    weight
                    weightUnit
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: any
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(mutation, {
    cartId,
    lines,
  })

  if (data.cartLinesAdd.userErrors.length > 0) {
    console.error("[Shopify] addLinesToCart userErrors:", data.cartLinesAdd.userErrors)
    return null
  }

  return data.cartLinesAdd.cart
}

/**
 * Get full cart object by ID
 */
export async function getCartById(cartId: string): Promise<any> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                  }
                  product {
                    handle
                    title
                  }
                  weight
                  weightUnit
                }
              }
              attributes {
                key
                value
              }
            }
          }
        }
      }
    }
  `

  try {
    const data = await storefrontFetch<{
      cart: any | null
    }>(query, { cartId })

    return data.cart
  } catch (error) {
    console.error("[Shopify] Error fetching cart:", error)
    return null
  }
}

/**
 * Update cart line quantities
 */
export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<any> {
  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                    product {
                      handle
                      title
                    }
                    weight
                    weightUnit
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await storefrontFetch<{
    cartLinesUpdate: {
      cart: any
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(mutation, {
    cartId,
    lines,
  })

  if (data.cartLinesUpdate.userErrors.length > 0) {
    console.error("[Shopify] updateCartLines userErrors:", data.cartLinesUpdate.userErrors)
    throw new Error(data.cartLinesUpdate.userErrors[0].message)
  }

  return data.cartLinesUpdate.cart
}

/**
 * Remove cart lines
 */
export async function removeCartLines(cartId: string, lineIds: string[]): Promise<any> {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                    product {
                      handle
                      title
                    }
                    weight
                    weightUnit
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await storefrontFetch<{
    cartLinesRemove: {
      cart: any
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(mutation, {
    cartId,
    lineIds,
  })

  if (data.cartLinesRemove.userErrors.length > 0) {
    console.error("[Shopify] removeCartLines userErrors:", data.cartLinesRemove.userErrors)
    throw new Error(data.cartLinesRemove.userErrors[0].message)
  }

  return data.cartLinesRemove.cart
}
