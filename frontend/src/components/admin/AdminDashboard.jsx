import { useState } from "react";
import { useNavigate } from "react-router-dom";

import charminarImg from "../../assets/heritage/charminar.jpg";
import golcondaImg from "../../assets/heritage/golconda.jpg";
import warangalImg from "../../assets/heritage/warangal.jpg";

const initialSubmissions = [
  {
    id: 1,
    site: "Charminar",
    location: "Hyderabad, Telangana",
    volunteer: "Volunteer 101",
    image: charminarImg,
    status: "Pending Review",
  },
  {
    id: 2,
    site: "Golconda Fort",
    location: "Hyderabad, Telangana",
    volunteer: "Volunteer 204",
    image: golcondaImg,
    status: "Pending Review",
  },
  {
    id: 3,
    site: "Warangal Fort",
    location: "Warangal, Telangana",
    volunteer: "Volunteer 315",
    image: warangalImg,
    status: "Pending Review",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [search, setSearch] = useState("");

  const handleApprove = (id) => {
    setSubmissions((prev) =>
      prev.filter((submission) => submission.id !== id)
    );
  };

  const handleReject = (id) => {
    setSubmissions((prev) =>
      prev.filter((submission) => submission.id !== id)
    );
  };

  const filteredSubmissions = submissions.filter((submission) =>
    submission.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex-grow bg-[#F9EBD4] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-heritage-red">
            Volunteer Submission Verification
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-gray-600 leading-8">
            Review and verify heritage submissions submitted by volunteers
            before they become visible on the heritage portal.
          </p>

          <div className="w-24 h-1 bg-heritage-red mx-auto rounded-full mt-6"></div>
        </div>

        <div className="flex justify-center mt-8">
          <input
            type="text"
            placeholder="Search heritage site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg rounded border border-heritage-border bg-[#FCFAF2] px-5 py-3 outline-none transition-all duration-300 focus:border-heritage-red"
          />
        </div>

        <div className="mt-8 space-y-6">
          {filteredSubmissions.length === 0 ? (
            <div className="rounded-xl border border-heritage-border bg-[#FCFAF2] py-14 text-center">
              <h3 className="text-2xl font-semibold text-heritage-red">
                No submissions found
              </h3>

              <p className="mt-3 text-gray-600">
                Try searching for another heritage site.
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-heritage-border bg-[#FCFAF2] shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="grid gap-6 p-5 md:grid-cols-[180px_1fr]">
                  <img
                    src={submission.image}
                    alt={submission.site}
                    className="h-40 w-full rounded-lg object-cover"
                  />

                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="text-3xl font-bold text-heritage-red">
                            {submission.site}
                          </h2>

                          <p className="mt-2 text-gray-600">
                            {submission.location}
                          </p>
                        </div>

                        <span className="rounded-full bg-[#F9EBD4] px-3 py-1.5 text-xs font-medium text-heritage-red">
                          {submission.status}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Volunteer</p>

                          <p className="font-semibold text-gray-800">
                            {submission.volunteer}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Category</p>

                          <p className="font-semibold text-gray-800">
                            Historical Monument
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Submitted</p>

                          <p className="font-semibold text-gray-800">
                            Today
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Verification
                          </p>

                          <p className="font-semibold text-gray-800">
                            Awaiting Review
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap justify-end gap-3">                        <button
                          onClick={() =>
                            navigate(`/admin/submission/${submission.id}`)
                          }
                          className="rounded border border-heritage-border bg-[#FCFAF2] px-5 py-2.5 font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => handleReject(submission.id)}
                          className="rounded border border-red-300 px-5 py-2.5 font-medium text-red-700 transition-all duration-300 hover:bg-red-50"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleApprove(submission.id)}
                          className="rounded bg-heritage-red px-5 py-2.5 font-medium text-[#FFFDF9] shadow transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#722111] hover:shadow-md"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}