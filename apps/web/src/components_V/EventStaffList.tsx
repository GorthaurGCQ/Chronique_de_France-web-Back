type StaffMember = {
  userId: string;
  role: "ANIMATEUR" | "ORGANISATEUR";
  name: string;
  email?: string;
};

type Props = {
  staff?: StaffMember[];
  fallbackName?: string | null;
  compact?: boolean;
};

export default function EventStaffList({ staff = [], fallbackName, compact = false }: Props) {
  if (staff.length === 0) {
    return <span>{fallbackName ?? "—"}</span>;
  }

  const organisateurs = staff.filter((s) => s.role === "ORGANISATEUR");
  const animateurs = staff.filter((s) => s.role === "ANIMATEUR");

  if (compact) {
    return (
      <span>
        {staff.map((s) => `${s.name} (${s.role === "ORGANISATEUR" ? "org." : "anim."})`).join(", ")}
      </span>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.85rem" }}>
      {organisateurs.length > 0 && (
        <div>
          <strong>Organisateur{organisateurs.length > 1 ? "s" : ""} :</strong>{" "}
          {organisateurs.map((s) => s.name).join(", ")}
        </div>
      )}
      {animateurs.length > 0 && (
        <div>
          <strong>Animateur{animateurs.length > 1 ? "s" : ""} :</strong>{" "}
          {animateurs.map((s) => s.name).join(", ")}
        </div>
      )}
    </div>
  );
}
