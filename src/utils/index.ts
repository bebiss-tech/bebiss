export const getNameInitials = (name: string): string => {
  const words = name
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, " ")
    .replace(/[^a-z0-9]/gi, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  const initials = words
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return initials;
};
