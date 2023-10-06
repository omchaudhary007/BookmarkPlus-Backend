export function isValidEmail(email: string): boolean {
  if (!email) return false;
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  if (!password) return false;
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidCategory(val?: string) {
  if (!val) return true;
  return val.length <= 30;
}

export function isValidTags(tags?: unknown): tags is string[] {
  if (!tags) return true;

  if (!Array.isArray(tags)) return false;

  return tags.every((t) => typeof t === "string" && t.length <= 20);
}

export function isValidNote(note?: string) {
  if (!note) return true;
  return note.length <= 500;
}
