export function getDisplayName(
  email: string,
  metadata: Record<string, unknown> | null,
) {
  const metadataName =
    typeof metadata?.full_name === "string"
      ? metadata.full_name
      : typeof metadata?.name === "string"
        ? metadata.name
        : null;

  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}
