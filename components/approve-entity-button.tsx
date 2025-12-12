"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface ApproveEntityButtonProps {
  entityId: string
  entityType: "organization" | "company"
}

export function ApproveEntityButton({ entityId, entityType }: ApproveEntityButtonProps) {
  const t = useTranslations("ApproveEntityButton")
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType }),
      })
      router.refresh()
    })
  }

  return (
    <Button size="sm" onClick={handleApprove} disabled={pending}>
      {pending ? t("approving") : t("approve")}
    </Button>
  )
}

