export interface Restaurant {
  id: string;
  name: string;
  categories: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  modifierGroups: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: Record<string, string[]>; // groupId -> optionIds
  notes: string;
  lineTotal: number;
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
}

export interface OrderSummary {
  restaurantId: string;
  restaurantName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    selectedOptions: string[];
    notes: string;
    lineTotal: number;
  }[];
  totals: {
    subtotal: number;
    tax: number;
    fees: number;
    total: number;
  };
}