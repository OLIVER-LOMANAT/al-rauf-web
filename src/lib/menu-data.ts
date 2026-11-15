/**
 * Illustrative menu content for the website concept.
 * Dishes, prices and options are placeholders and are NOT Al Rauf's confirmed menu.
 */

export type OptionChoice = {
  id: string
  label: string
  price: number
}

export type OptionGroup = {
  id: string
  title: string
  required: boolean
  /** Maximum number of choices. 1 renders as radios, more renders as checkboxes. */
  max: number
  choices: OptionChoice[]
}

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  note?: string
  options?: OptionGroup[]
}

export type MenuCategory = {
  id: string
  label: string
  intro: string
  image: string
  imageAlt: string
  options?: OptionGroup[]
  items: MenuItem[]
}

export const CURRENCY = 'KES'

export function formatPrice(amount: number) {
  return `${CURRENCY} ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const breadExtras: OptionGroup = {
  id: 'extras',
  title: 'Add something extra?',
  required: false,
  max: 3,
  choices: [
    { id: 'flatbread', label: 'Warm flatbread', price: 80 },
    { id: 'toum', label: 'Garlic toum', price: 100 },
    { id: 'pickles', label: 'House pickles', price: 120 },
  ],
}

const mainSide: OptionGroup = {
  id: 'side',
  title: 'Choose your side',
  required: true,
  max: 1,
  choices: [
    { id: 'saffron-rice', label: 'Saffron rice', price: 0 },
    { id: 'vermicelli-rice', label: 'Vermicelli rice', price: 0 },
    { id: 'fries', label: 'Seasoned fries', price: 0 },
    { id: 'fattoush', label: 'Fattoush salad', price: 150 },
  ],
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'starters',
    label: 'Starters',
    intro: 'Small plates made for the middle of the table.',
    image: '/images/mezze.png',
    imageAlt: 'Mezze plates of hummus, tabbouleh, falafel and olives',
    options: [
      {
        id: 'size',
        title: 'Choose your portion',
        required: true,
        max: 1,
        choices: [
          { id: 'regular', label: 'Regular', price: 0 },
          { id: 'sharing', label: 'Sharing (serves 3–4)', price: 350 },
        ],
      },
      breadExtras,
    ],
    items: [
      { id: 'hummus', name: 'Hummus', description: 'Chickpea purée, tahini, lemon and olive oil.', price: 450 },
      { id: 'moutabal', name: 'Moutabal', description: 'Smoked aubergine, tahini, pomegranate.', price: 500 },
      { id: 'tabbouleh', name: 'Tabbouleh', description: 'Parsley, bulgur, tomato, mint, lemon.', price: 450 },
      {
        id: 'falafel',
        name: 'Falafel',
        description: 'Crisp chickpea fritters with tahini sauce.',
        price: 550,
        note: 'Vegetarian',
      },
    ],
  },
  {
    id: 'mains',
    label: 'Main Courses',
    intro: 'Generous plates to anchor a shared meal.',
    image: '/images/hero-feast.png',
    imageAlt: 'A shared table of grilled skewers, rice, salad and flatbread',
    options: [mainSide, breadExtras],
    items: [
      { id: 'lamb', name: 'Slow-cooked Lamb', description: 'Tender lamb, aromatic spices, warm bread.', price: 1650 },
      {
        id: 'musakhan',
        name: 'Chicken Musakhan',
        description: 'Sumac chicken, caramelised onion, flatbread.',
        price: 1200,
      },
      {
        id: 'vegetable-stew',
        name: 'Vegetable Stew',
        description: 'Seasonal vegetables in a tomato broth.',
        price: 900,
        note: 'Vegetarian',
      },
    ],
  },
  {
    id: 'grills',
    label: 'Grills',
    intro: 'Cooked over flame and served with garlic sauce.',
    image: '/images/grill.png',
    imageAlt: 'Mixed grill platter with kofta, chicken skewers and grilled vegetables',
    options: [
      {
        id: 'spice',
        title: 'Choose your spice level',
        required: true,
        max: 1,
        choices: [
          { id: 'mild', label: 'Mild', price: 0 },
          { id: 'medium', label: 'Medium', price: 0 },
          { id: 'hot', label: 'Hot', price: 0 },
        ],
      },
      mainSide,
      breadExtras,
    ],
    items: [
      {
        id: 'mixed-grill',
        name: 'Mixed Grill',
        description: 'Kofta, shish tawook and lamb, grilled vegetables.',
        price: 1950,
      },
      { id: 'shish-tawook', name: 'Shish Tawook', description: 'Marinated chicken skewers, garlic toum.', price: 1100 },
      { id: 'lamb-kofta', name: 'Lamb Kofta', description: 'Spiced minced lamb, parsley, onion.', price: 1250 },
    ],
  },
  {
    id: 'rice',
    label: 'Rice Dishes',
    intro: 'Fragrant rice, slow-cooked and finished with nuts.',
    image: '/images/rice.png',
    imageAlt: 'Saffron rice with lamb, almonds and pine nuts on a brass tray',
    options: [
      {
        id: 'portion',
        title: 'Choose your portion',
        required: true,
        max: 1,
        choices: [
          { id: 'single', label: 'Single plate', price: 0 },
          { id: 'tray', label: 'Family tray (serves 4)', price: 2400 },
        ],
      },
    ],
    items: [
      {
        id: 'lamb-saffron-rice',
        name: 'Lamb with Saffron Rice',
        description: 'Spiced rice, toasted almonds, raisins.',
        price: 1800,
      },
      { id: 'kabsa', name: 'Chicken Kabsa', description: 'Long-grain rice, baharat, roasted chicken.', price: 1350 },
      {
        id: 'vermicelli-rice',
        name: 'Vermicelli Rice',
        description: 'Buttered rice with golden vermicelli.',
        price: 350,
        note: 'Side',
      },
    ],
  },
  {
    id: 'desserts',
    label: 'Desserts',
    intro: 'Something sweet to finish, best with tea.',
    image: '/images/dessert.png',
    imageAlt: 'Kunafa with pistachio, baklava and rose petals',
    options: [
      {
        id: 'pairing',
        title: 'Pair it with a drink?',
        required: false,
        max: 1,
        choices: [
          { id: 'arabic-coffee', label: 'Arabic coffee', price: 200 },
          { id: 'mint-tea', label: 'Mint tea', price: 180 },
        ],
      },
    ],
    items: [
      { id: 'kunafa', name: 'Kunafa', description: 'Shredded pastry, soft cheese, syrup, pistachio.', price: 650 },
      { id: 'baklava', name: 'Baklava', description: 'Layered filo, nuts and honey syrup.', price: 500 },
      { id: 'muhallabia', name: 'Muhallabia', description: 'Milk pudding with rose water.', price: 400 },
    ],
  },
  {
    id: 'drinks',
    label: 'Coffee & Drinks',
    intro: 'From a slow afternoon coffee to fresh juice.',
    image: '/images/coffee-pour.png',
    imageAlt: 'Arabic coffee being poured from a brass dallah',
    items: [
      {
        id: 'arabic-coffee',
        name: 'Arabic Coffee',
        description: 'Lightly roasted with cardamom, served with dates.',
        price: 250,
      },
      { id: 'mint-tea', name: 'Mint Tea', description: 'Fresh mint, brewed to order.', price: 200 },
      {
        id: 'lemon-mint',
        name: 'Fresh Lemon Mint',
        description: 'Lemon, mint, crushed ice.',
        price: 300,
        options: [
          {
            id: 'sweetness',
            title: 'How sweet?',
            required: true,
            max: 1,
            choices: [
              { id: 'no-sugar', label: 'No sugar', price: 0 },
              { id: 'less-sweet', label: 'Less sweet', price: 0 },
              { id: 'regular', label: 'Regular', price: 0 },
            ],
          },
        ],
      },
      {
        id: 'espresso',
        name: 'Espresso',
        description: 'Single or double shot.',
        price: 200,
        options: [
          {
            id: 'shot',
            title: 'Choose your shot',
            required: true,
            max: 1,
            choices: [
              { id: 'single', label: 'Single', price: 0 },
              { id: 'double', label: 'Double', price: 80 },
            ],
          },
        ],
      },
    ],
  },
]

export function getItemOptions(item: MenuItem, category: MenuCategory) {
  return item.options ?? category.options ?? []
}
