/**
 * Jay's live packages and prices. The homepage price list and the assessment
 * results both read from here, so a price change is made once.
 */
export type PricePackage = {
  id: "fresh-start" | "monthly" | "group" | "online" | "marvel";
  name: string;
  note: string;
  detail: string;
  price: string;
  per: string;
  popular?: boolean;
  waitlist?: boolean;
};

export const PRICES: PricePackage[] = [
  {
    id: "online",
    name: "Online Coaching",
    note: "Flexible coaching, wherever you train",
    detail: "A personal training plan built around your goals, equipment and week. Includes weekly video check-ins, exercise form reviews and direct WhatsApp support from Jay. Rolling monthly, no long contract.",
    price: "£120",
    per: "a month",
  },
  {
    id: "fresh-start",
    name: "Fresh Start",
    note: "Best for testing the water",
    detail: "5 × 1-2-1 sessions. Movement and posture assessment, a personalised plan and WhatsApp support between sessions. Use within 8 weeks.",
    price: "£250",
    per: "one-off · £50 a session",
  },
  {
    id: "monthly",
    name: "1-2-1 Monthly",
    note: "Most popular",
    detail: "8 sessions a month. Everything in Fresh Start, plus bespoke nutrition guidance, monthly body composition tracking and WhatsApp access seven days a week. Pause with 14 days’ notice.",
    price: "£280",
    per: "a month · £35 a session · direct debit, no contract",
    popular: true,
  },
  {
    id: "group",
    name: "Small Group Block",
    note: "Accountability on a budget",
    detail: "8 sessions, maximum four people. Mixed abilities, programmed every week.",
    price: "£200",
    per: "one-off · £25 a session",
  },
  {
    id: "marvel",
    name: "Marvel Bootcamp",
    note: "Founding rate",
    detail: "Small-group bootcamps at Marvel The Studio. Capped spaces, and the founding rate stays while you do.",
    price: "£50",
    per: "a month",
    waitlist: true,
  },
];

export const packageById = (id: PricePackage["id"]) => PRICES.find((p) => p.id === id)!;
