"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://10.115.217.175:5000";

export default function EventPage() {
  const params = useParams();
  const eventId = params?.eventId;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getEvent() {
      try {
        setLoading(true);
        setError("");

        if (!eventId) {
          throw new Error("Event ID not found.");
        }

        const url = `${API_URL}/api/events/${encodeURIComponent(eventId)}`;

        console.log("Fetching event from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          let message = `Backend request failed: ${response.status}`;

          try {
            const errorData = await response.json();

            if (errorData?.error) {
              message += ` - ${errorData.error}`;
            }
          } catch {
            // Response was not JSON
          }

          throw new Error(message);
        }

        const data = await response.json();

        console.log("Backend event response:", data);

        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);

        setError(
          err.message || "Unable to load event details."
        );
      } finally {
        setLoading(false);
      }
    }

    getEvent();
  }, [eventId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="px-6 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"></div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Loading event...
          </h2>

          <p className="mt-2 text-slate-500">
            Getting the event details for you.
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Unable to load event
          </h2>

          <p className="mt-4 text-slate-500">
            {error}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-left text-sm">
            <p className="font-semibold text-slate-700">
              Event ID
            </p>

            <p className="mt-1 text-slate-500">
              {eventId || "Not found"}
            </p>

            <p className="mt-4 font-semibold text-slate-700">
              API URL
            </p>

            <p className="mt-1 break-all text-slate-500">
              {API_URL}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Try Again
          </button>

          <a
            href="/recommendations"
            className="ml-3 inline-block rounded-xl bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-200"
          >
            Back to Recommendations
          </a>
        </div>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formattedStartDate = event.start_date
    ? new Date(event.start_date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Not specified";

  const formattedEndDate = event.end_date
    ? new Date(event.end_date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Not specified";

  // =====================================================
  // COST
  // =====================================================

  const cost =
    event.cost_inr !== null &&
    event.cost_inr !== undefined &&
    event.cost_inr !== ""
      ? `₹${Number(event.cost_inr).toFixed(2)}`
      : "Free";

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="flex items-center justify-between border-b border-purple-100 bg-white px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-purple-700">
          HackGURU
        </h1>

        <a
          href="/recommendations"
          className="rounded-full bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-200"
        >
          Back to Recommendations
        </a>
      </nav>


      {/* =================================================
          EVENT DETAILS
      ================================================= */}

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">

          {/* Event type */}

          <span className="inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            {event.event_type || "Event"}
          </span>


          {/* Title */}

          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            {event.title}
          </h2>


          {/* Domain */}

          {event.domain && (
            <p className="mt-4 text-lg font-semibold text-purple-600">
              {event.domain}
            </p>
          )}


          {/* Description */}

          <div className="mt-8 rounded-3xl border border-purple-100 bg-white p-8 shadow-lg shadow-purple-100">
            <h3 className="text-2xl font-bold">
              About this event
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              {event.description ||
                "No description available for this event."}
            </p>
          </div>


          {/* =================================================
              EVENT INFORMATION
          ================================================= */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* Location */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-600">
                Location
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                📍 {event.location || "Not specified"}
              </p>
            </div>


            {/* Mode */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-600">
                Mode
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                💻 {event.mode || "Not specified"}
              </p>
            </div>


            {/* Start Date */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-600">
                Start Date
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                🗓 {formattedStartDate}
              </p>
            </div>


            {/* End Date */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-600">
                End Date
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                🗓 {formattedEndDate}
              </p>
            </div>


            {/* Duration */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-600">
                Duration
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                ⏱ {event.duration_days || "Not specified"} day(s)
              </p>
            </div>


            {/* Cost */}

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-600">
                Cost
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                💰 {cost}
              </p>
            </div>

          </div>


          {/* =================================================
              REGISTRATION
          ================================================= */}

          <div className="mt-8 rounded-3xl border border-purple-100 bg-white p-8 shadow-lg shadow-purple-100">

            <h3 className="text-2xl font-bold">
              Registration Details
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Registration Deadline
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {event.registration_deadline
                    ? new Date(
                        event.registration_deadline
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>


              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Organizer
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {event.organizer || "Not specified"}
                </p>
              </div>


              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Team Size
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {event.min_team_size || "—"} -{" "}
                  {event.max_team_size || "—"} members
                </p>
              </div>

            </div>

          </div>


          {/* =================================================
              ELIGIBILITY
          ================================================= */}

          {event.eligibility && (
            <div className="mt-8 rounded-3xl border border-purple-100 bg-purple-50 p-8">

              <h3 className="text-2xl font-bold">
                Eligibility
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {event.eligibility}
              </p>

            </div>
          )}


          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <div className="mt-10">
            <a
              href="/recommendations"
              className="inline-block rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-8 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              ← Back to Recommendations
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}