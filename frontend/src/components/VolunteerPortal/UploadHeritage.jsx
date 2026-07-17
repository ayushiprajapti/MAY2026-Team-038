import { useState } from "react";

export default function UploadHeritage() {
  const [formData, setFormData] = useState({
    heritageName: "",
    category: "",
    heritageType: "",
    era: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    mapsLink: "",
    description: "",
    significance: "",
    condition: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    declaration: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Heritage submission sent for review.");
  };

  return (
    <main className="heritage-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="heritage-card rounded-2xl p-8">

          <p className="uppercase tracking-[0.25em] text-[#C98716] text-sm font-semibold">
            Volunteer Submission
          </p>

          <h1 className="font-serif text-5xl text-[#7F1D1D] mt-4">
            Upload Heritage Site
          </h1>

          <p className="mt-5 text-[#5F4631] leading-8 max-w-3xl">
            Submit details of monuments, forts, temples, museums,
            archaeological remains or other heritage structures.
            Your submission will be reviewed by heritage experts
            before being published.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="heritage-card rounded-2xl p-8 mt-8 space-y-10"
        >

          <section>

            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
              Heritage Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-2 font-medium">
                  Heritage Site Name
                </label>

                <input
                  type="text"
                  name="heritageName"
                  value={formData.heritageName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="Example: Shaniwar Wada"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                >

                  <option value="">Select Category</option>

                  <option>Fort</option>

                  <option>Temple</option>

                  <option>Mosque</option>

                  <option>Church</option>

                  <option>Museum</option>

                  <option>Palace</option>

                  <option>Memorial</option>

                  <option>Archaeological Site</option>

                  <option>Other</option>

                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Heritage Type
                </label>

                <select
                  name="heritageType"
                  value={formData.heritageType}
                  onChange={handleChange}className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  
                >

                  <option value="">Select Type</option>

                  <option>Tangible</option>

                  <option>Intangible</option>

                  <option>Natural</option>

                  <option>Cultural Landscape</option>

                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Approximate Era
                </label>

                <input
                  type="text"
                  name="era"
                  value={formData.era}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="Example: 17th Century"
                />

              </div>

            </div>

          </section>

          <section>

            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
              Location Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">              <div>

                <label className="block mb-2 font-medium">
                  Street Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="Enter complete address"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Latitude
                </label>

                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="18.5204"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Longitude
                </label>

                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="73.8567"
                />

              </div>

              <div className="md:col-span-2">

                <label className="block mb-2 font-medium">
                  Google Maps Link
                </label>

                <input
                  type="url"
                  name="mapsLink"
                  value={formData.mapsLink}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="https://maps.google.com/..."
                />

              </div>

            </div>

          </section>

          <section>

            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
              Heritage Description
            </h2>

            <div className="space-y-6">

              <div>

                <label className="block mb-2 font-medium">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 resize-none"
                  placeholder="Describe the heritage site..."
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Historical Significance
                </label>

                <textarea
                  rows="5"
                  name="significance"
                  value={formData.significance}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 resize-none"
                  placeholder="Explain why this heritage site is important..."
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Current Condition
                </label>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                >
                  <option value="">Select Condition</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Needs Restoration</option>
                  <option>Damaged</option>
                  <option>Ruins</option>
                </select>

              </div>

            </div>

          </section>

          <section>

            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
              Upload Photographs
            </h2>

            <div className="border-2 border-dashed border-[#D8C2A7] rounded-xl p-10 text-center">

              <input
                type="file"
                multiple
                accept="image/*"
                className="block mx-auto"
              />

              <p className="mt-4 text-[#5F4631]">
                Upload clear images of the heritage site from multiple angles.
              </p>

            </div>

          </section>          <section>

            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div>

                <label className="block mb-2 font-medium">
                  Contact Name
                </label>

                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="Your Name"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="name@example.com"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                  placeholder="+91 XXXXX XXXXX"
                />

              </div>

            </div>

          </section>

          <section className="border rounded-xl p-6 bg-[#FFF9F2]">

            <label className="flex items-start gap-3">

              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleChange}
                className="mt-1"
              />

              <span className="text-[#5F4631] leading-7">

                I hereby declare that the information submitted is true to
                the best of my knowledge. I understand that INTACH may
                verify, modify or reject this submission during the review
                process.

              </span>

            </label>

          </section>

          <div className="flex flex-wrap justify-end gap-4">

            <button
              type="button"
              className="px-8 py-3 rounded-lg border border-[#C98716] text-[#C98716] hover:bg-[#FFF5E8] transition"
            >
              Save Draft
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-[#7F1D1D] text-white hover:bg-[#651717] transition"
            >
              Submit for Review
            </button>

          </div>

        </form>

      </div>

    </main>

  );
}