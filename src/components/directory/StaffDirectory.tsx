import type { Staff } from "@/types/staff";
import { Avatar } from "@/components/common/Avatar";

export function StaffDirectory({ staff }: { staff: Staff[] }) {
  const units = Array.from(new Set(staff.map((member) => member.unit)));

  return (
    <div className="d-grid gap-5">
      {units.map((unit) => (
        <div key={unit}>
          <h2 className="h5 mb-3">{unit}</h2>
          <div className="row g-4">
            {staff.filter((member) => member.unit === unit).map((member) => (
              <div className="col-sm-6 col-lg-4" key={member.id}>
                <article className="staff-card">
                  <Avatar name={member.name} photoUrl={member.photoUrl} />
                  <h3 className="h6 mb-1">{member.name}</h3>
                  <p className="staff-role mb-0">{member.position}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
