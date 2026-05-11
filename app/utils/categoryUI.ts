import {
  Apple,
  Croissant,
  Milk,
  Fish,
  Beef,
  Popcorn,
  CupSoda,
  ShoppingBasket,
} from "lucide-react";
import { ElementType } from "react";

export const categoryUIMap: Record<
  string,
  {
    icon: ElementType;
    bgColor: string;
  }
> = {
  "grocery-staples": { icon: Apple, bgColor: "bg-red-50" },
  "breads-bakery": { icon: Croissant, bgColor: "bg-orange-50" },
  "breakfast-dairy": { icon: Milk, bgColor: "bg-blue-50" },
  "meats-seafood": { icon: Fish, bgColor: "bg-cyan-50" },
  meats: { icon: Beef, bgColor: "bg-rose-50" },
  "chips-snacks": { icon: Popcorn, bgColor: "bg-yellow-50" },
  beverages: { icon: CupSoda, bgColor: "bg-purple-50" },

  default: {
    icon: ShoppingBasket,
    bgColor: "bg-gray-50",
  },
};
