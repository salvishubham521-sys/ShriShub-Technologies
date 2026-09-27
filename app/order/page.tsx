"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { services } from "@/lib/config";

function OrderForm() {
  const params = useSearchParams();
  const router = useRouter();

  const selected = params.get("service") || "custom";

  const service = useMemo(
    () =>
      services.find((s) => s.slug === selected) ||
      services[services.length - 1],
    [selected]
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "India",
    company: "",
    communication: "dashboard",
    projectName: "",
    purpose: "",
    pages: "",
    features: "",
    design: "",
    references: "",
    contentReady: false,
    domainStatus: "unsure",
    specialRequirements: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function update(k: string, v: any) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const r = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.purpose,
          service: service.slug,
          requirements: form,
        }),
      });

      const data = await r.json();

      sessionStorage.setItem(
        "nexora_quote",
        JSON.stringify({
          service,
          form,
          analysis: data.analysis,
        })
      );

      router.push("/dashboard?preview=1");
    } catch {
      setError("We couldn't process the request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section container">
      <div className="eyebrow">Project intake</div>

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div>
          <h1 style={{ fontSize: "clamp(40px,6vw,62px)" }}>
            Tell us what you're building.
          </h1>

          <p className="lead">
            Selected service: <strong>{service.name}</strong>. Your answers
            become the initial project brief.
          </p>

          <div className="card">
            <h3>Starting price</h3>

            <div className="price">
              ₹{service.price.toLocaleString("en-IN")}
            </div>

            <p>
              Final price is controlled by the admin configuration and, for
              custom work, may require scope approval.
            </p>
          </div>
        </div>

        <form className="card form" onSubmit={submit}>
          <label>
            Full name
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </label>

          <label>
            Phone / WhatsApp
            <input
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </label>

          <label>
            Company / organization
            <input
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </label>

          <label>
            Project name
            <input
              required
              value={form.projectName}
              onChange={(e) => update("projectName", e.target.value)}
            />
          </label>

          <label>
            What do you want to build?
            <textarea
              required
              value={form.purpose}
              onChange={(e) => update("purpose", e.target.value)}
              placeholder="Explain the idea in your own words."
            />
          </label>

          <label>
            Required pages
            <textarea
              value={form.pages}
              onChange={(e) => update("pages", e.target.value)}
              placeholder="Home, About, Services, Contact..."
            />
          </label>

          <label>
            Required features
            <textarea
              value={form.features}
              onChange={(e) => update("features", e.target.value)}
              placeholder="Booking, login, dashboard, payments..."
            />
          </label>

          <label>
            Design preferences
            <textarea
              value={form.design}
              onChange={(e) => update("design", e.target.value)}
            />
          </label>

          <label>
            Reference / competitor websites
            <textarea
              value={form.references}
              onChange={(e) => update("references", e.target.value)}
            />
          </label>

          <label>
            Domain status
            <select
              value={form.domainStatus}
              onChange={(e) => update("domainStatus", e.target.value)}
            >
              <option value="unsure">Not sure</option>
              <option value="have-domain">I have a domain</option>
              <option value="need-domain">I need a domain</option>
            </select>
          </label>

          <label>
            Anything else?
            <textarea
              value={form.specialRequirements}
              onChange={(e) =>
                update("specialRequirements", e.target.value)
              }
            />
          </label>

          {error && (
            <div style={{ color: "var(--danger)" }}>{error}</div>
          )}

          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Analyzing…" : "Analyze & continue →"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <main className="section container">
          <div className="eyebrow">Project intake</div>
          <h1>Loading...</h1>
        </main>
      }
    >
      <OrderForm />
    </Suspense>
  );
}