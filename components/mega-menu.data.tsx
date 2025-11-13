"use client"

import { getMenuProducts } from "@/lib/menu-products"
import { MegaMenu } from "./mega-menu"
import type { NavItem } from "@/lib/types"

interface MegaMenuDataProps {
  items: NavItem[]
  title: string
  onClose: () => void
}

export default async function MegaMenuData({ items, title, onClose }: MegaMenuDataProps) {
  // Only fetch products for Butchery and Deli & Biltong categories
  let productProps = {}

  if (title === "Shop") {
    // Fetch Butchery sub-panes
    const [beef, lamb, pork, chicken] = await Promise.all([
      getMenuProducts("beef", 8),
      getMenuProducts("lamb", 8),
      getMenuProducts("pork", 8),
      getMenuProducts("chicken", 8),
    ])

    // Fetch Deli & Biltong sub-panes
    const [biltong, droewors, sticks, thinSticks, baconBiltong, other] = await Promise.all([
      getMenuProducts("biltong", 8),
      getMenuProducts("droewors", 8),
      getMenuProducts("sticks", 8),
      getMenuProducts("thin-sticks", 8),
      getMenuProducts("bacon-biltong", 8),
      getMenuProducts("other", 8),
    ])

    productProps = {
      beefProducts: beef,
      lambProducts: lamb,
      porkProducts: pork,
      chickenProducts: chicken,
      biltongProducts: biltong,
      droeworsProducts: droewors,
      sticksProducts: sticks,
      thinSticksProducts: thinSticks,
      baconBiltongProducts: baconBiltong,
      otherDeliProducts: other,
    }
  }

  return <MegaMenu items={items} title={title} onClose={onClose} {...productProps} />
}
