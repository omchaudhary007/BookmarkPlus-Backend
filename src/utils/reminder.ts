export type ReminderType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export function getNextDue(type: ReminderType, current: Date): Date | null {
  const next = new Date(current);

  switch (type) {
    case "ONCE":
      return null;

    case "DAILY":
      next.setDate(next.getDate() + 1);
      return next;

    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      return next;

    case "MONTHLY":
      const day = next.getDate();

      next.setMonth(next.getMonth() + 1);

      if (next.getDate() !== day) {
        next.setDate(0);
      }

      return next;

    default:
      return null;
  }
}
