import type { Restaurant } from '@/types/restaurant';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'starbucks',
    name: 'Starbucks',
    categories: [
      {
        id: 'drinks',
        name: 'Drinks',
        items: [
          {
            id: 'caffe-latte',
            name: 'Caffè Latte',
            description: 'Rich espresso balanced with steamed milk',
            basePrice: 4.25,
            modifierGroups: [
              {
                id: 'size',
                name: 'Size',
                required: true,
                multiSelect: false,
                options: [
                  { id: 'tall', name: 'Tall', price: 0 },
                  { id: 'grande', name: 'Grande', price: 0.50 },
                  { id: 'venti', name: 'Venti', price: 0.80 },
                ],
              },
              {
                id: 'milk',
                name: 'Milk',
                required: true,
                multiSelect: false,
                options: [
                  { id: '2percent', name: '2%', price: 0 },
                  { id: 'nonfat', name: 'Nonfat', price: 0 },
                  { id: 'almond', name: 'Almond', price: 0.60 },
                  { id: 'oat', name: 'Oat', price: 0.60 },
                ],
              },
              {
                id: 'temp',
                name: 'Temperature',
                required: true,
                multiSelect: false,
                options: [
                  { id: 'hot', name: 'Hot', price: 0 },
                  { id: 'iced', name: 'Iced', price: 0 },
                ],
              },
              {
                id: 'syrup',
                name: 'Syrup',
                required: false,
                multiSelect: true,
                options: [
                  { id: 'vanilla', name: 'Vanilla', price: 0.60 },
                  { id: 'caramel', name: 'Caramel', price: 0.60 },
                  { id: 'hazelnut', name: 'Hazelnut', price: 0.60 },
                ],
              },
            ],
          },
          {
            id: 'cold-brew',
            name: 'Cold Brew',
            description: 'Smooth, bold coffee served cold',
            basePrice: 3.95,
            modifierGroups: [
              {
                id: 'size',
                name: 'Size',
                required: true,
                multiSelect: false,
                options: [
                  { id: 'tall', name: 'Tall', price: 0 },
                  { id: 'grande', name: 'Grande', price: 0.50 },
                  { id: 'venti', name: 'Venti', price: 0.80 },
                ],
              },
              {
                id: 'additions',
                name: 'Additions',
                required: false,
                multiSelect: true,
                options: [
                  { id: 'sweet-cream', name: 'Sweet Cream', price: 0.70 },
                  { id: 'extra-ice', name: 'Extra Ice', price: 0 },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'food',
        name: 'Food',
        items: [
          {
            id: 'bacon-gouda',
            name: 'Bacon Gouda Sandwich',
            description: 'Savory bacon and melted gouda on artisan bread',
            basePrice: 4.45,
            modifierGroups: [],
          },
        ],
      },
    ],
  },
  {
    id: 'chick-fil-a',
    name: 'Chick-fil-A',
    categories: [
      {
        id: 'mains',
        name: 'Mains',
        items: [
          {
            id: 'chicken-sandwich',
            name: 'Chicken Sandwich',
            description: 'Original chicken breast on a toasted bun',
            basePrice: 4.75,
            modifierGroups: [
              {
                id: 'cheese',
                name: 'Cheese',
                required: false,
                multiSelect: false,
                options: [
                  { id: 'add-cheese', name: 'Add Cheese', price: 0.50 },
                ],
              },
              {
                id: 'pickles',
                name: 'Pickles',
                required: false,
                multiSelect: false,
                options: [
                  { id: 'no-pickles', name: 'No Pickles', price: 0 },
                ],
              },
              {
                id: 'sauces',
                name: 'Sauces',
                required: false,
                multiSelect: true,
                options: [
                  { id: 'cfa', name: 'Chick-fil-A Sauce', price: 0 },
                  { id: 'polynesian', name: 'Polynesian', price: 0 },
                  { id: 'bbq', name: 'BBQ', price: 0 },
                  { id: 'honey-mustard', name: 'Honey Mustard', price: 0 },
                ],
              },
            ],
          },
          {
            id: 'nuggets-8',
            name: '8-Count Nuggets',
            description: 'Bite-sized pieces of boneless chicken breast',
            basePrice: 5.15,
            modifierGroups: [
              {
                id: 'sauces',
                name: 'Sauces',
                required: false,
                multiSelect: true,
                options: [
                  { id: 'cfa', name: 'Chick-fil-A Sauce', price: 0 },
                  { id: 'polynesian', name: 'Polynesian', price: 0 },
                  { id: 'bbq', name: 'BBQ', price: 0 },
                  { id: 'honey-mustard', name: 'Honey Mustard', price: 0 },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sides',
        name: 'Sides',
        items: [
          {
            id: 'waffle-fries',
            name: 'Waffle Fries (Medium)',
            description: 'Crispy waffle-cut potato fries',
            basePrice: 2.25,
            modifierGroups: [],
          },
        ],
      },
      {
        id: 'drinks',
        name: 'Drinks',
        items: [
          {
            id: 'lemonade',
            name: 'Lemonade',
            description: 'Fresh-squeezed lemonade',
            basePrice: 2.35,
            modifierGroups: [
              {
                id: 'size',
                name: 'Size',
                required: true,
                multiSelect: false,
                options: [
                  { id: 'small', name: 'Small', price: 0 },
                  { id: 'medium', name: 'Medium', price: 0.50 },
                  { id: 'large', name: 'Large', price: 0.80 },
                ],
              },
              {
                id: 'ice',
                name: 'Ice Level',
                required: false,
                multiSelect: false,
                options: [
                  { id: 'light', name: 'Light Ice', price: 0 },
                  { id: 'normal', name: 'Normal Ice', price: 0 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function getRestaurantById(id: string): Restaurant | null {
  return RESTAURANTS.find(r => r.id === id) || null;
}