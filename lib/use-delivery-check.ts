"use client"

import { useCallback, useEffect, useState } from "react"
import { isLocalPostalCode, isValidPostalCode } from "@/lib/delivery-zones"

export const DELIVERY_CHECK_STORAGE_KEY = "hk_delivery_check"
export const DELIVERY_CHECK_EVENT = "hk-delivery-check-change"

export type DeliveryCheck = { code: string; local: boolean }
export type DeliveryCheckStatus = "unknown" | "unchecked" | "checked"

function parseDeliveryCheck(value: unknown): DeliveryCheck | null {
  if (!value || typeof value !== "object") return null
  const { code, local } = value as Record<string, unknown>
  if (typeof code !== "string" || !isValidPostalCode(code) || typeof local !== "boolean") return null
  return { code, local }
}

function readStoredCheck(): DeliveryCheck | null {
  try {
    const raw = window.localStorage.getItem(DELIVERY_CHECK_STORAGE_KEY)
    if (!raw) return null
    return parseDeliveryCheck(JSON.parse(raw))
  } catch {
    return null
  }
}

function broadcast(check: DeliveryCheck | null) {
  try {
    window.dispatchEvent(new CustomEvent<DeliveryCheck | null>(DELIVERY_CHECK_EVENT, { detail: check }))
  } catch {
    // Event dispatch is best-effort; the local instance has already updated.
  }
}

export function useDeliveryCheck() {
  const [status, setStatus] = useState<DeliveryCheckStatus>("unknown")
  const [check, setCheck] = useState<DeliveryCheck | null>(null)

  useEffect(() => {
    const apply = (next: DeliveryCheck | null) => {
      setCheck(next)
      setStatus(next ? "checked" : "unchecked")
    }

    apply(readStoredCheck())

    const handleChange = (event: Event) => {
      // Prefer the event payload so instances stay in sync even when storage is unavailable.
      const detail = (event as CustomEvent<unknown>).detail
      apply(detail === undefined ? readStoredCheck() : parseDeliveryCheck(detail))
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === DELIVERY_CHECK_STORAGE_KEY) apply(readStoredCheck())
    }

    window.addEventListener(DELIVERY_CHECK_EVENT, handleChange)
    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener(DELIVERY_CHECK_EVENT, handleChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const save = useCallback((code: string): DeliveryCheck => {
    const trimmed = code.trim()
    const next: DeliveryCheck = { code: trimmed, local: isLocalPostalCode(trimmed) }
    try {
      window.localStorage.setItem(DELIVERY_CHECK_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage may be unavailable (private mode, quota); keep the in-memory result.
    }
    setCheck(next)
    setStatus("checked")
    broadcast(next)
    return next
  }, [])

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(DELIVERY_CHECK_STORAGE_KEY)
    } catch {
      // Ignore storage errors; still reset in-memory state.
    }
    setCheck(null)
    setStatus("unchecked")
    broadcast(null)
  }, [])

  return { status, check, save, clear }
}
