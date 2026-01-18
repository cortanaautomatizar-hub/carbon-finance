const STORAGE_KEY = 'carbon_finance_subscriptions';
const COLORS_KEY = 'carbon_finance_serviceColors';

type Subscription = {
  id: number;
  name: string;
  amount: number;
  paymentMethod?: string;
  dueDate?: number;
  status?: string;
  category?: string;
  renewalDate?: string;
  card?: string;
};

const readJson = (key: string) => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: any) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export function getAllSubscriptions(): Subscription[] {
  const data = readJson(STORAGE_KEY);
  return Array.isArray(data) ? data : [];
}

export function getServiceColors(): Record<string, string> {
  const data = readJson(COLORS_KEY);
  return data && typeof data === 'object' ? data : {};
}

export function saveSubscriptions(subs: Subscription[]) {
  writeJson(STORAGE_KEY, subs);
}

export function saveServiceColors(colors: Record<string, string>) {
  writeJson(COLORS_KEY, colors);
}

export function addSubscription(payload: Omit<Subscription, 'id'>): Subscription {
  const subs = getAllSubscriptions();
  const newId = subs.length > 0 ? Math.max(...subs.map(s => s.id)) + 1 : 1;
  const entry: Subscription = { id: newId, ...payload };
  subs.push(entry);
  saveSubscriptions(subs);
  return entry;
}

export function updateSubscription(updated: Subscription): Subscription | null {
  const subs = getAllSubscriptions();
  const idx = subs.findIndex(s => s.id === updated.id);
  if (idx === -1) return null;
  subs[idx] = { ...subs[idx], ...updated };
  saveSubscriptions(subs);
  return subs[idx];
}

export function removeSubscription(id: number): Subscription | null {
  const subs = getAllSubscriptions();
  const idx = subs.findIndex(s => s.id === id);
  if (idx === -1) return null;
  const [removed] = subs.splice(idx, 1);
  saveSubscriptions(subs);
  return removed;
}

export function setServiceColor(name: string, color: string) {
  const colors = getServiceColors();
  colors[name] = color;
  saveServiceColors(colors);
}

export function removeServiceColor(name: string) {
  const colors = getServiceColors();
  if (colors && colors[name]) {
    delete colors[name];
    saveServiceColors(colors);
  }
}
