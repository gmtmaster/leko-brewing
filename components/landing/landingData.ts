export const beers = [
  {
    name: "Daylight Haze",
    style: "Hazy IPA",
    abv: "6.8%",
    note: "Trópusi gyümölcs, citrus, puha kortyérzet",
    detail: "A luminous flagship IPA with soft haze, bright citrus oils, and a finish that stays crisp instead of heavy.",
    accent: "#38bdf8",
    labelSrc: "/textures/daylight-haze-label.png",
  },
  {
    name: "Sweet Illusion",
    style: "American Wheat",
    abv: "4.5%",
    note: "Narancs, korianderlehelet, nyári frissesség",
    detail: "Light wheat texture, orange peel brightness, and a barely-there spice note built for long tables and golden hours.",
    accent: "#f6c76f",
    labelSrc: "/textures/sweet_illusion.png",
  },
  {
    name: "Luna Blanca",
    style: "Witbier",
    abv: "5.1%",
    note: "Fehér citrus, koriander, lágy búzás alap",
    detail: "A clean, pale witbier with a moonlit citrus edge, soft grain, and a calm mineral snap.",
    accent: "#e0f2fe",
    labelSrc: "/textures/luna-blanca-label.png",
  },
  {
    name: "Coastal Pines",
    style: "West Coast IPA",
    abv: "6%",
    note: "Grapefruit, fenyőgyanta, száraz lecsengés",
    detail: "Pine resin, grapefruit peel, and a dry finish shaped for people who still love bitterness with polish.",
    accent: "#86efac",
    labelSrc: "/textures/coastal_pines.png",
  },
];

export type Beer = (typeof beers)[number];

export const featuredBeer = beers[0];

export const philosophy = [
  {
    label: "Batch",
    value: "Small runs",
    text: "Recipes are tuned in compact batches so each release can stay sharp, seasonal, and intentional.",
  },
  {
    label: "Build",
    value: "Clean structure",
    text: "Aromatic hops, soft water, and restrained sweetness keep every beer expressive without getting loud.",
  },
  {
    label: "Finish",
    value: "Designed cans",
    text: "The label, the liquid, and the first pour are treated as one product experience.",
  },
];
