import { apiFetch, apiFetchForm } from "./client";

export async function listMySubmissions() {
  return apiFetch("/volunteer/heritage-submissions");
}

export async function getMySubmission(id) {
  return apiFetch(`/volunteer/heritage-submissions/${id}`);
}

export async function createSubmission(payload) {
  return apiFetch("/volunteer/heritage-submissions", {
    method: "POST",
    body: payload,
  });
}

export async function uploadSubmissionImage(file) {
  const form = new FormData();
  form.append("file", file);
  return apiFetchForm("/volunteer/heritage-submissions/upload-image", form);
}
