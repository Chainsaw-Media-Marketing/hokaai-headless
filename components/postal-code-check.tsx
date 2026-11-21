"use client"

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { isValidPostalCode } from "@/lib/delivery-zones"
import { useDeliveryCheck, type DeliveryCheck } from "@/lib/use-delivery-check"

type PostalCodeCheckVariant = "header" | "cart" | "section"

interface PostalCodeCheckProps {
  variant: PostalCodeCheckVariant
  autoFocus?: boolean
  onDone?: (result: DeliveryCheck) => void
}

const INVALID_MESSAGE = "Please enter a 4-digit postal code."

export function getDeliveryResultMessage(check: DeliveryCheck) {
  return check.local
    ? `\u2713 ${check.code} is in our local area: R50 delivery, free over R1 500.`
    : `${check.code} is outside our local area: R350 courier. Collection in store is free.`
}

export function PostalCodeCheck({ variant, autoFocus = false, onDone }: PostalCodeCheckProps) {
  const { status, check, save } = useDeliveryCheck()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<DeliveryCheck | null>(null)
  const [editing, setEditing] = useState(false)
  const [focusRequest, setFocusRequest] = useState(autoFocus ? 1 : 0)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const messageId = useId()

  useEffect(() => {
    if (focusRequest > 0) inputRef.current?.focus()
  }, [focusRequest])

  const result =
    variant === "section"
      ? !editing && status === "checked"
        ? check
        : null
      : variant === "header"
        ? submitted
        : null

  const isCart = variant === "cart"
  const isSection = variant === "section"

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValidPostalCode(value)) {
      setError(INVALID_MESSAGE)
      inputRef.current?.focus()
      return
    }
    setError(null)
    const next = save(value)
    setSubmitted(next)
    setEditing(false)
    setValue("")
    onDone?.(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) {
      event.preventDefault()
    }
  }

  const handleChange = () => {
    setEditing(true)
    setFocusRequest((n) => n + 1)
  }

  const message = error ?? (result ? getDeliveryResultMessage(result) : "")

  return (
    <div className={cn(isSection && "flex flex-col items-center text-center")}>
      {!result && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className={cn("flex flex-wrap items-center gap-2", isSection && "justify-center")}
        >
          <label
            htmlFor={inputId}
            className={cn(
              isCart ? "sr-only" : "text-slate-700 font-semibold",
              variant === "header" && "text-xs w-full",
              isSection && "text-sm",
            )}
          >
            Postal code
          </label>
          <input
            ref={inputRef}
            id={inputId}
            name="postal-code"
            type="text"
            inputMode="numeric"
            maxLength={4}
            autoComplete="postal-code"
            placeholder="e.g. 0081"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) setError(null)
            }}
            onKeyDown={handleKeyDown}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={messageId}
            className={cn(
              "w-24 rounded-md border border-slate-300 bg-white px-3 text-slate-900 tabular-nums placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-500",
              isCart ? "h-8 text-xs" : "h-9 text-sm",
              error && "border-red-700",
            )}
          />
          <button
            type="submit"
            className={cn(
              "rounded-md bg-brand-primary font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
              isCart ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm",
            )}
          >
            Check
          </button>
        </form>
      )}

      <div className={cn("flex flex-wrap items-baseline gap-x-2", isSection && "justify-center")}>
        <p
          id={messageId}
          role="status"
          aria-live="polite"
          className={cn(
            message && (result ? "" : "mt-2"),
            isCart || variant === "header" ? "text-xs" : "text-sm",
            error ? "text-brand-red" : "text-slate-700",
          )}
        >
          {message}
        </p>
        {result && isSection && (
          <button
            type="button"
            onClick={handleChange}
            className="text-sm font-semibold text-brand-primary underline underline-offset-4 hover:opacity-80"
          >
            change
          </button>
        )}
      </div>
    </div>
  )
}
