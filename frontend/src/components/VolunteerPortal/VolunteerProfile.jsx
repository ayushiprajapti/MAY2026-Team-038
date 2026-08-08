import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function VolunteerProfile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    is_active: true,
  });

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("intach_token");

      if (!accessToken) {
        setError("You are not logged in. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("intach_token");
            localStorage.removeItem("intach_user");
          }

          throw new Error(
            data?.detail || "Failed to load your profile."
          );
        }

        setProfile(data);

        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("intach_token");

    if (!accessToken) {
      setError("You are not logged in. Please log in again.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("intach_token");
          localStorage.removeItem("intach_user");
        }

        throw new Error(
          data?.detail || "Failed to update your profile."
        );
      }

      setProfile(data);

      setForm({
        full_name: data.full_name || "",
        phone: data.phone || "",
      });

      setSuccess("Profile updated successfully.");

      const storedUser = localStorage.getItem("intach_user");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          localStorage.setItem(
            "intach_user",
            JSON.stringify({
              ...parsedUser,
              fullName: data.full_name,
              full_name: data.full_name,
              email: data.email,
              phone: data.phone,
              role: data.role,
            })
          );
        } catch {
          // Ignore malformed legacy localStorage data.
        }
      }
    } catch (err) {
      setError(err.message || "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = useMemo(() => {
    const name = profile.full_name?.trim();

    if (!name) {
      return "V";
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile.full_name]);

  const formattedRole = useMemo(() => {
    if (!profile.role) {
      return "Registered Member";
    }

    return profile.role
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }, [profile.role]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8ecd7] px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="heritage-card rounded-2xl p-10 text-center text-[#5F4631] font-semibold">
            Loading your profile...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8ecd7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="py-6 border-b border-heritage-border/20 text-left">
          <p className="uppercase tracking-[0.2em] text-[#c28230] text-xs font-bold">
            Volunteer Portal
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#9c2d19] mt-2">
            Volunteer Profile
          </h1>

          <p className="mt-3 text-[#5F4631] text-base leading-relaxed max-w-3xl">
            Manage your account information and view your current membership
            and account status.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800 text-left">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 text-left">
            {success}
          </div>
        )}

        <section className="grid lg:grid-cols-3 gap-8">

          {/* Profile Summary */}
          <div className="heritage-card rounded-2xl p-8">
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full bg-[#7F1D1D] text-white flex items-center justify-center text-4xl font-bold">
                {initials}
              </div>
            </div>

            <h2 className="text-center text-2xl font-serif mt-6 text-[#7F1D1D]">
              {profile.full_name || "Volunteer"}
            </h2>

            <p className="text-center text-[#5F4631] mt-2">
              {formattedRole}
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#5F4631]">Account Status</span>

                <span
                  className={
                    profile.is_active
                      ? "text-green-700 font-semibold"
                      : "text-red-700 font-semibold"
                  }
                >
                  {profile.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#5F4631]">Role</span>

                <span className="text-[#2b2118] font-semibold text-right">
                  {formattedRole}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#5F4631]">Email</span>

                <span className="text-[#2b2118] font-semibold text-right break-all">
                  {profile.email || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="heritage-card rounded-2xl p-8 lg:col-span-2">
            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6 text-left">
              Personal Information
            </h2>

            <form onSubmit={handleSave}>
              <div className="grid md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block mb-2 font-medium text-left"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-left"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-lg border border-[#D9C7B1] bg-[#F2EADF] px-4 py-3 text-[#5F4631]/70 cursor-not-allowed"
                  />

                  <p className="mt-1.5 text-[11px] text-[#5F4631]/60 text-left">
                    Email address cannot be changed here.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 font-medium text-left"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  />
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block mb-2 font-medium text-left"
                  >
                    Account Role
                  </label>

                  <input
                    id="role"
                    type="text"
                    value={formattedRole}
                    disabled
                    className="w-full rounded-lg border border-[#D9C7B1] bg-[#F2EADF] px-4 py-3 text-[#5F4631]/70 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Fields not supported by current DB */}
              <div className="mt-6 rounded-xl border border-[#D9C7B1] bg-[#FFF8ED] p-4 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9c2d19]">
                  Additional profile information
                </p>

                <p className="mt-2 text-xs leading-relaxed text-[#5F4631]/75">
                  City, state, occupation, and skills/interests are not
                  currently stored in the users database table, so they are
                  not shown as editable profile fields. This prevents the
                  frontend from displaying information that cannot actually
                  be persisted.
                </p>
              </div>

              {/* Save */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-[#7F1D1D] text-white font-semibold hover:bg-[#671717] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}