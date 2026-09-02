"use client";

import { useEffect, useState } from "react";

export default function Recommendations() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getRecommendations() {
      try {
        // Get the profile saved on the profile page
        const savedProfile = localStorage.getItem("studentProfile");

        if (!savedProfile) {
          setError("Student profile not found. Please complete your profile first.");
          setLoading(false);
          return;
        }

        const studentProfile = JSON.parse(savedProfile);

        // Display profile information
        setProfile(studentProfile);

        // Your backend expects the student ID
        const studentId = studentProfile.name;

        // Backend recommendation endpoint
        const API_URL =
          `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/${studentId}`;

        console.log("Calling backend:", API_URL);
        console.log("Student ID:", studentId);

        // Backend uses GET /:studentId
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Backend request failed: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log("Backend response:", data);

        // Your friend's backend returns:
        // {
        //   student_id: "...",
        //   career: "...",
        //   recommendations: [...]
        // }

        setEvents(data.recommendations || []);
      } catch (err) {
        console.error("Recommendation error:", err);
        setError(err.message || "Unable to load recommendations.");
      } finally {
        setLoading(false);
      }
    }

    getRecommendations();
  }, []);

  /* =====================================================
     LOADING SCREEN
     ===================================================== */

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

  /* =====================================================
     ERROR SCREEN
     ===================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-white text-slate-900">

        {/* Navigation */}
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

        {/* Error */}
        <section className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">

            <h2 className="text-2xl font-bold text-slate-900">
              Unable to load recommendations
            </h2>

            <p className="mt-4 text-slate-500">
              {error}
            </p>

            <a
              href="/profile"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              Edit Profile
            </a>

          </div>

        </section>

      </main>
    );
  }

  /* =====================================================
     MAIN RECOMMENDATIONS PAGE
     ===================================================== */

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
            {profile
              ? `${profile.name}, events picked for you`
              : "Events picked for you"}
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            Based on your skills, interests, career goals and preferences.
          </p>

        </div>

      </section>

      {/* =================================================
          EVENT CARDS
      ================================================= */}

      <section className="px-6 pb-16">

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">

          {events.length === 0 ? (

            /* No Recommendations */
            <div className="col-span-full rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-lg">

              <h3 className="text-2xl font-bold text-slate-900">
                No recommendations found
              </h3>

              <p className="mt-3 text-slate-500">
                Try updating your skills, interests or career goals.
              </p>

              <a
                href="/profile"
                className="mt-6 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
              >
                Update Profile
              </a>

            </div>

          ) : (

            /* Recommendations */
            events.map((event) => (

              <div
                key={event.event_id}
                className="group rounded-3xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100 transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
              >

                {/* Event Type + Match */}
                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                    {event.event_type}
                  </span>

                  <span className="text-lg font-bold text-purple-600">
                    {event.score}% Match
                  </span>

                </div>

                {/* Event Title */}
                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-slate-500">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="mt-6 space-y-2 text-sm text-slate-600">

                  <p>
                    📍 {event.location || "Location not specified"}
                  </p>

                  <p>
                    🗓 {event.start_date || "Date not specified"}
                  </p>

                  <p>
                    💻 {event.mode || "Mode not specified"}
                  </p>

                  {event.cost_inr !== null &&
                    event.cost_inr !== undefined && (
                      <p>
                        💰 ₹{event.cost_inr}
                      </p>
                    )}

                </div>

                {/* Matching Information */}
                <div className="mt-6">

                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    Why this matches you
                  </p>

                  <div className="space-y-2">

                    {event.reasons &&
                    event.reasons.length > 0 ? (

                      event.reasons.map((reason, index) => (

                        <div
                          key={index}
                          className="rounded-xl bg-purple-50 px-3 py-2 text-xs text-purple-700"
                        >
                          {reason}
                        </div>

                      ))

                    ) : (

                      <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                        Relevant to your career path
                      </div>

                    )}

                  </div>

                </div>

                {/* Matching Skills */}
                {event.matching_skills > 0 && (
                  <p className="mt-4 text-sm text-slate-500">
                    Matches{" "}
                    <span className="font-semibold text-purple-600">
                      {event.matching_skills}
                    </span>{" "}
                    career-related skill(s)
                  </p>
                )}

                {/* View Event */}
                <a
                  href={`/events/${event.event_id}`}
                  className="mt-6 block w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 py-3 text-center font-semibold text-white transition hover:shadow-lg"
                >
                  View Event
                </a>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
}