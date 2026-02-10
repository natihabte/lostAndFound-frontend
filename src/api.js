// Simple localStorage "API" - can be replaced with real backend API calls

const STORAGE_KEY = "lf_items_v1";
const USERS_KEY = "lf_users_v1";

export const USERS_KEY_CONST = USERS_KEY;

export function seedIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const seed = [
      {
        id: "1",
        title: "Lost - Black Wallet",
        category: "Document",
        description: "Black leather wallet with ID and two cards.",
        photo: null,
        location: "Main Street, City Center",
        contact: "+251900000000",
        status: "Lost",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        ownerId: "u1",
      },
      {
        id: "2",
        title: "Found - Small Brown Dog",
        category: "Pet",
        description: "Small brown dog with red collar. Very friendly.",
        photo: null,
        location: "Market Area",
        contact: "+251911111111",
        status: "Found",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
        ownerId: "u2",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    const users = [
      { id: "u1", name: "Alice", email: "alice@example.com" },
      { id: "u2", name: "Bob", email: "bob@example.com" },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function apiListItems() {
  seedIfEmpty();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function apiGetItem(id) {
  return apiListItems().find((i) => i.id === id) || null;
}

export function apiCreateItem(item) {
  const list = apiListItems();
  list.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return item;
}

export function apiUpdateItem(id, patch) {
  const list = apiListItems();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list[idx];
}

export function apiDeleteItem(id) {
  const list = apiListItems().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return true;
}