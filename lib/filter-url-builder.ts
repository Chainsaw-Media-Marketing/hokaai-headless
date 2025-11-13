export function buildFilterUrl(
  baseCollection: string,
  filters: {
    department?: string
    meat_type?: string
    cut_family?: string | string[]
    deli_type?: string
    bulk_type?: string | string[]
  },
): string {
  const params = new URLSearchParams()

  if (filters.department) {
    params.append("department", filters.department)
  }

  if (filters.meat_type) {
    params.append("meat_type", filters.meat_type)
  }

  if (filters.cut_family) {
    if (Array.isArray(filters.cut_family)) {
      filters.cut_family.forEach((value) => params.append("cut_family", value))
    } else {
      params.append("cut_family", filters.cut_family)
    }
  }

  if (filters.deli_type) {
    params.append("deli_type", filters.deli_type)
  }

  if (filters.bulk_type) {
    if (Array.isArray(filters.bulk_type)) {
      filters.bulk_type.forEach((value) => params.append("bulk_type", value))
    } else {
      params.append("bulk_type", filters.bulk_type)
    }
  }

  const queryString = params.toString()
  return queryString ? `/collections/${baseCollection}?${queryString}` : `/collections/${baseCollection}`
}
