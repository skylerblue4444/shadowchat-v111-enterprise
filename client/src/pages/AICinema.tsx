import React, { useState } from "react";

/**
 * AI Cinema
 * High-end video content and cinematic experiences
 */

export default function AICinema() {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("featured");

  const featuredMovies = [
    {
      id: 1,
      title: "The Rise of Hope AI",
      director: "Architect Agent",
      duration: "2:15",
      rating: 9.2,
      views: "1.2M",
      genre: "Documentary",
      poster: "🎬",
      description: "An epic journey through the evolution of artificial intelligence",
    },
    {
      id: 2,
      title: "Market Prophecy",
      director: "Analyst Agent",
      duration: "1:45",
      rating: 8.9,
      views: "856K",
      genre: "Thriller",
      poster: "📈",
      description: "A thrilling tale of predicting the future of finance",
    },
    {
      id: 3,
      title: "The Guardian's Dilemma",
      director: "Guardian Agent",
      duration: "2:30",
      rating: 8.7,
      views: "742K",
      genre: "Drama",
      poster: "🛡️",
      description: "A moral journey through security and trust",
    },
  ];

  const allMovies = [
    ...featuredMovies,
    {
      id: 4,
      title: "Code of Chaos",
      director: "Optimizer Agent",
      duration: "1:50",
      rating: 8.4,
      views: "634K",
      genre: "Action",
      poster: "⚡",
      description: "High-speed coding challenges and digital warfare",
    },
    {
      id: 5,
      title: "Healing Hearts",
      director: "Healer Agent",
      duration: "2:00",
      rating: 8.6,
      views: "521K",
      genre: "Romance",
      poster: "💚",
      description: "A touching story of connection and compassion",
    },
    {
      id: 6,
      title: "Innovation Unleashed",
      director: "Innovator Agent",
      duration: "1:55",
      rating: 8.8,
      views: "923K",
      genre: "Sci-Fi",
      poster: "🚀",
      description: "Exploring the boundaries of human and AI creativity",
    },
  ];

  const categories = ["featured", "trending", "new", "documentary", "action", "drama"];

  const displayMovies = selectedCategory === "featured" ? featuredMovies : allMovies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🎬 AI Cinema
        </h1>
        <p className="text-slate-400">Premium AI-generated movies and cinematic experiences</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-emerald-500 text-white"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {displayMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie.id)}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all group ${
              selectedMovie === movie.id ? "ring-2 ring-emerald-400" : ""
            }`}
          >
            {/* Poster */}
            <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-6xl relative overflow-hidden">
              {movie.poster}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-all">
                  <div className="text-4xl">▶️</div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-4">
              <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
              <p className="text-sm text-slate-400 mb-2">{movie.director}</p>
              <p className="text-xs text-slate-500 mb-3">{movie.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐ {movie.rating}</span>
                  <span className="text-slate-400">{movie.duration}</span>
                </div>
                <span className="text-emerald-400 text-xs">{movie.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Movie Details Panel */}
      {selectedMovie !== null && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
          {(() => {
            const movie = allMovies.find((m) => m.id === selectedMovie);
            return (
              <>
                <div className="grid grid-cols-3 gap-8">
                  {/* Poster */}
                  <div className="col-span-1">
                    <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-8xl rounded-lg mb-4">
                      {movie?.poster}
                    </div>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold mb-3">
                      ▶️ Watch Now
                    </button>
                    <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold">
                      ➕ Add to Watchlist
                    </button>
                  </div>

                  {/* Details */}
                  <div className="col-span-2">
                    <h2 className="text-3xl font-bold mb-2">{movie?.title}</h2>
                    <p className="text-slate-400 mb-4">{movie?.director}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Rating</div>
                        <div className="text-2xl font-bold text-yellow-400">⭐ {movie?.rating}/10</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Duration</div>
                        <div className="text-2xl font-bold">{movie?.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Genre</div>
                        <div className="text-2xl font-bold text-emerald-400">{movie?.genre}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Views</div>
                        <div className="text-2xl font-bold">{movie?.views}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-400 mb-2">Synopsis</div>
                      <p className="text-slate-300">{movie?.description}</p>
                    </div>

                    {/* Reviews */}
                    <div className="mt-6">
                      <h3 className="font-bold mb-3">User Reviews</h3>
                      <div className="space-y-3">
                        <div className="bg-slate-700/30 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">User123</span>
                            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                          </div>
                          <p className="text-sm text-slate-400">"Absolutely mind-blowing! The AI creativity is incredible."</p>
                        </div>
                        <div className="bg-slate-700/30 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">MovieBuff</span>
                            <span className="text-yellow-400">⭐⭐⭐⭐</span>
                          </div>
                          <p className="text-sm text-slate-400">"Great storytelling and production quality."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
