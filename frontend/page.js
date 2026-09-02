"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Recommendations() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getRecommendations() {
      try {
        setLoading(true);
        setError("");

        // -----------------------------------------
        // Get student profile from localStorage
        // -----------------------------------------
        const savedProfile = localStorage.getItem("studentProfile");

        if (!savedProfile) {
          throw new Error("Student profile not found.");
        }

        const studentProfile = JSON.parse(savedProfile);
        setProfile(studentProfile);

        // -----------------------------------------
        // Get student ID
        // -----------------------------------------
        const studentId =
          studentProfile.student_id ||
          studentProfile.studentId ||
          studentProfile.id;

        if (!studentId) {
          throw new Error("Student ID not found in profile.");
        }

        // -----------------------------------------
        // Check API URL
        // -----------------------------------------
        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        // -----------------------------------------
        // Backend endpoint
        //
        // GET /api/recommendations/:studentId
        // -----------------------------------------
        const url =
          `${API_URL}/api/recommendations/${encodeURIComponent(studentId)}`;

        console.log("Fetching recommendations from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        // -----------------------------------------
        // Handle backend errors
        // -----------------------------------------
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

        // -----------------------------------------
        // Convert response to JSON
        // -----------------------------------------
        const data = await response.json();

        console.log("Backend recommendation response:", data);

        // -----------------------------------------
        // Check recommendations
        // -----------------------------------------
        if (!Array.isArray(data.recommendations)) {
          throw new Error(
            "Invalid response from recommendation API."
          );
        }

        setEvents(data.recommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);

        setError(
          err.message || "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    }

    getRecommendations();
  }, []);

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="px-6 text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"></div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Finding the best events for you...
          </h2>

          <p className="mt-2 text-slate-500">
            Analyzing your skills, interests and career goals.
          </p>

        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-xl px-6 text-center">

          <h2 className="text-3xl font-bold text-slate-900">
            Unable to load recommendations
          </h2>

          <p className="mt-4 text-slate-500">
            {error}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-left text-sm">
            <p className="font-semibold text-slate-700">
              API URL:
            </p>

            <p className="mt-1 break-all text-slate-500">
              {API_URL || "Not configured"}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Try Again
          </button>

        </div>
      </main>
    );
  }

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
          href="/profile"
          className="rounded-full bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-200"
        >
          Edit Profile
        </a>

      </nav>


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-8 pt-14">

        <div className="mx-auto max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            AI Recommendations
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            {profile?.name
              ? `${profile.name}, events picked for you`
              : "Events picked for you"}
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            Based on your skills, interests, career goals and preferences.
          </p>

        </div>

      </section>


      {/* =================================================
          NO EVENTS
      ================================================= */}

      {events.length === 0 && (
        <section className="px-6 pb-16">

          <div className="mx-auto max-w-6xl rounded-3xl border border-purple-100 bg-purple-50 p-10 text-center">

            <h3 className="text-2xl font-bold">
              No recommendations found
            </h3>

            <p className="mt-3 text-slate-500">
              We couldn't find events matching your current profile.
            </p>

          </div>

        </section>
      )}


      {/* =================================================
          EVENT CARDS
      ================================================= */}

      {events.length > 0 && (
        <section className="px-6 pb-16">

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">

            {events.map((event) => {

              // -----------------------------------------
              // Convert backend score into 0-100%
              // -----------------------------------------
              const rawScore = Number(event.score) || 0;

              const matchPercentage = Math.min(
                Math.round(rawScore),
                100
              );

              // -----------------------------------------
              // Format date
              // -----------------------------------------
              const formattedDate = event.start_date
                ? new Date(event.start_date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "Date not specified";

              // -----------------------------------------
              // Format cost
              // -----------------------------------------
              const cost =
                event.cost_inr !== null &&
                event.cost_inr !== undefined &&
                event.cost_inr !== ""
                  ? `₹${Number(event.cost_inr).toFixed(2)}`
                  : "Free";

              return (
                <div
                  key={event.event_id}
                  className="group flex flex-col rounded-3xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100 transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
                >

                  {/* -----------------------------------
                      Event Type + Match
                  ----------------------------------- */}

                  <div className="flex items-center justify-between">

                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                      {event.event_type || "Event"}
                    </span>

                    <span className="text-lg font-bold text-purple-600">
                      {matchPercentage}% Match
                    </span>

                  </div>


                  {/* -----------------------------------
                      Event Title
                  ----------------------------------- */}

                  <h3 className="mt-6 text-2xl font-bold">
                    {event.title}
                  </h3>


                  {/* -----------------------------------
                      Description
                  ----------------------------------- */}

                  <p className="mt-3 text-slate-500">
                    {event.description}
                  </p>


                  {/* -----------------------------------
                      Event Details
                  ----------------------------------- */}

                  <div className="mt-6 space-y-2 text-sm text-slate-600">

                    <p>
                      📍 {event.location || "Location not specified"}
                    </p>

                    <p>
                      🗓 {formattedDate}
                    </p>

                    <p>
                      💻 {event.mode || "Mode not specified"}
                    </p>

                    <p>
                      💰 {cost}
                    </p>

                  </div>


                  {/* -----------------------------------
                      Why this matches you
                  ----------------------------------- */}

                  <div className="mt-6">

                    <p className="mb-3 text-sm font-semibold">
                      Why this matches you
                    </p>

                    <div className="space-y-2">

                      {Array.isArray(event.reasons) &&
                        event.reasons.map((reason, index) => (
                          <div
                            key={`${event.event_id}-reason-${index}`}
                            className="rounded-xl bg-purple-50 px-3 py-2 text-sm text-purple-700"
                          >
                            {reason}
                          </div>
                        ))}

                    </div>

                  </div>


                  {/* -----------------------------------
                      Matching Information
                  ----------------------------------- */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    {event.matching_skills > 0 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {event.matching_skills} skill match
                        {event.matching_skills > 1 ? "es" : ""}
                      </span>
                    )}

                    {event.interest_matches > 0 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {event.interest_matches} interest match
                        {event.interest_matches > 1 ? "es" : ""}
                      </span>
                    )}

                  </div>


                  {/* -----------------------------------
                      VIEW EVENT
                  ----------------------------------- */}

                  <a
                    href={`/events/${event.event_id}`}
                    className="mt-6 block w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    View Event
                  </a>

                </div>
              );
            })}

          </div>

        </section>
      )}

    </main>
  );
}