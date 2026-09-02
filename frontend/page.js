export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold">
          HackGURU
        </h1>

        <button className="rounded-lg bg-white px-5 py-2 font-semibold text-slate-950">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
          AI-Powered Event Discovery
        </p>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Find the right events for your future.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Discover hackathons, workshops, competitions and conferences
          personalized to your skills, interests and career goals.
        </p>

        <a
        href="/profile"
        className="mt-8 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-200 transition hover:scale-[1.02] hover:shadow-xl"
        >
        Get Personalized Recommendations
        </a>

      </section>

    </main>
  );
}