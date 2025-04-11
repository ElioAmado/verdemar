"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function GuestCounter() {
  const [adults, setAdults] = React.useState(2)
  const [children, setChildren] = React.useState(0)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">Adults</span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setAdults(Math.max(1, adults - 1))}
            disabled={adults <= 1}
          >
            <MinusIcon className="h-3 w-3" />
            <span className="sr-only">Decrease adults</span>
          </Button>
          <span className="w-8 text-center">{adults}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setAdults(Math.min(10, adults + 1))}
            disabled={adults >= 10}
          >
            <PlusIcon className="h-3 w-3" />
            <span className="sr-only">Increase adults</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Children</span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setChildren(Math.max(0, children - 1))}
            disabled={children <= 0}
          >
            <MinusIcon className="h-3 w-3" />
            <span className="sr-only">Decrease children</span>
          </Button>
          <span className="w-8 text-center">{children}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setChildren(Math.min(10, children + 1))}
            disabled={children >= 10}
          >
            <PlusIcon className="h-3 w-3" />
            <span className="sr-only">Increase children</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
