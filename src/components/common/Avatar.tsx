function initials(name: string) {
  return name.replace(/[^a-zA-Z ]/g, "").trim().split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function Avatar({ name, photoUrl, className = "staff-avatar" }: { name: string; photoUrl?: string; className?: string }) {
  if (photoUrl) {
    return <img alt={name} className={`${className} avatar-photo`} src={photoUrl} />;
  }
  return <div aria-hidden="true" className={className}>{initials(name)}</div>;
}
