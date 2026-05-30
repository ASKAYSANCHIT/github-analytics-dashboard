"use client";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { GitHubCalendar } from "react-github-calendar";
import { motion } from "framer-motion";
const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#84cc16",
];

interface Repo {
  name: string;
  stars: number;
  forks: number;
  language: string;
  description: string;
  url: string;
}

interface GitHubData {
  user: {
    name: string;
    login: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    public_repos: number;
    location: string;
    company: string;
    blog: string;
    created_at: string;
  };
  languages: { name: string; value: number }[];
  topRepos: Repo[];
  totalStars: number;
  totalForks: number;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/github?username=${username}`);
      const json = await res.json();
      if (json.error) setError(json.error);
      else setData(json);
    } catch {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const memberSince = data
    ? new Date(data.user.created_at).getFullYear()
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #312e81 0%, #0f172a 40%, #020617 100%)",
        color: "#ffffff",
      }}
    >
      {/* TOP NAV BAR */}
      <div
        style={{
          borderBottom: "2px solid #1a1a1a",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          // borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          GH·Analytics
        </div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: "#888880",
            letterSpacing: 1,
          }}
        >
          GitHub Profile Intelligence
        </div>
      </div>

      {/* HERO SECTION */}
      <div
        style={{
          borderBottom: "2px solid #1a1a1a",
          padding: "40px 40px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 40,
          alignItems: "end",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#e8431a",
              marginBottom: 16,
              fontWeight: 700,
            }}
          >
            ◆ Developer Analytics
          </div>
          <h1
            style={{
              fontSize: "clamp(42px,6vw,72px)",
              fontWeight: 900,
              letterSpacing: "-4px",
              lineHeight: 0.95,
              color: "#ffffff",
            }}
          >
            GitHub
            <br />
            <span
              style={{
                color: "#818cf8",
                textShadow: "0 0 40px rgba(99,102,241,.25)",
              }}
            >
              {" "}
              Intelligence{" "}
            </span>
            <br />
            Dashboard
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#888880",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: 380,
            }}
          >
            Enter any GitHub username to get a complete breakdown of their
            repositories, languages, stars, and contribution patterns.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#888880",
              marginBottom: 10,
            }}
          >
            Search Developer
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              placeholder="e.g. torvalds"
              style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "16px",
                fontSize: 16,
                fontFamily: "'Space Mono', monospace",
                outline: "none",
                width: "100%",
              }}
            />
            <button
              onClick={fetchData}
              disabled={loading}
              style={{
                padding: "14px 24px",
                background: loading
                  ? "#475569"
                  : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                borderRadius: "16px",
                color: "white",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Analyzing Profile..." : "Analyze →"}{" "}
            </button>
          </div>
          {error && (
            <p
              style={{
                marginTop: 10,
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                color: "#e8431a",
              }}
            >
              ✕{" "}
              {error === "User not found"
                ? "User not found. Check username."
                : error}
            </p>
          )}
        </div>
      </div>

      {/* RESULTS */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: "0 40px 60px" }}
        >
          {/* PROFILE ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              gap: 24,
              alignItems: "center",
              padding: 24,
              marginTop: 24,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
            }}
          >
            <img
              src={data.user.avatar}
              alt={data.user.name}
              style={{
                width: 80,
                height: 80,
                border: "3px solid #6366f1",
                borderRadius: "50%",
                boxShadow: "0 0 30px rgba(99,102,241,.4)",
                display: "block",
              }}
            />

            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "#888880",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                @{data.user.login} · Member since {memberSince}
              </div>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: -1,
                  color: "#ffffff",
                  marginBottom: 6,
                }}
              >
                {data.user.name || data.user.login}{" "}
              </h2>
              <a
                href={`https://github.com/${data.user.login}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#818cf8",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                View GitHub Profile →
              </a>
              {data.user.bio && (
                <p style={{ fontSize: 14, color: "#888880", fontWeight: 300 }}>
                  {data.user.bio}
                </p>
              )}
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                {data.user.location && (
                  <span style={{ fontSize: 13, color: "#888880" }}>
                    📍 {data.user.location}
                  </span>
                )}
                {data.user.company && (
                  <span style={{ fontSize: 13, color: "#888880" }}>
                    🏢 {data.user.company}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                background: "#e8431a",
                color: "white",
                padding: "8px 16px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                alignSelf: "flex-start",
              }}
            >
              Active Dev
            </div>
          </div>

          {/* STATS ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
              marginTop: 24,
              borderBottom: "2px solid #1a1a1a",
            }}
          >
            {[
              {
                label: "Repositories",
                value: data.user.public_repos,
                color: "#e8431a",
              },
              {
                label: "Followers",
                value: data.user.followers,
                color: "#2563eb",
              },
              {
                label: "Following",
                value: data.user.following,
                color: "#16a34a",
              },
              {
                label: "Total Stars",
                value: data.totalStars,
                color: "#9333ea",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "28px 24px",
                  // borderRight: i < 3 ? "1px solid #e0dcd5" : "none",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    letterSpacing: -2,
                    color: stat.color,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {stat.value.toLocaleString()}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#888880",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div
            style={{
              marginTop: 32,
              padding: 32,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
            }}
          >
            <h3
              style={{
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Contribution Activity
            </h3>

            <GitHubCalendar username={data.user.login} colorScheme="dark" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
              gap: 20,
              alignItems: "stretch",
              borderBottom: "2px solid #1a1a1a",
              marginTop: 32,
            }}
          >
            {/* Language Pie */}
            <div
              style={{
                padding: 28,
                // borderRight: "1px solid #e0dcd5",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                borderRadius: "24px",
                minHeight: "340px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#888880",
                  marginBottom: 20,
                  fontWeight: 700,
                }}
              >
                Language Breakdown
              </div>
              {data.languages.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data.languages}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.languages.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        backdropFilter: "blur(20px)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#888880",
                  }}
                >
                  No language data available
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {data.languages.slice(0, 6).map((lang, i) => (
                  <div
                    key={lang.name}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: COLORS[i],
                        borderRadius: "50%",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: "#888880",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {lang.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div
              style={{
                padding: 28,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                borderRadius: "24px",
                minHeight: "340px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#888880",
                  marginBottom: 20,
                  fontWeight: 700,
                }}
              >
                Top Repos By Stars
              </div>
              {data.topRepos.some((repo) => repo.stars > 0) ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.topRepos.slice(0, 5)} barSize={28}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e0dcd5"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "#888880",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stars" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888880",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                  }}
                >
                  No starred repositories yet
                </div>
              )}
            </div>
          </div>

          {/* TOP REPOS GRID */}
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            <div className="insight-card">
              <h4>Top Language</h4>
              <p>{data.languages?.[0]?.name || "N/A"}</p>
            </div>

            <div className="insight-card">
              <h4>Top Repository</h4>
              <p>{data.topRepos?.[0]?.name || "N/A"}</p>
            </div>

            <div className="insight-card">
              <h4>Total Forks</h4>
              <p>{data.totalForks}</p>
            </div>

            <div className="insight-card">
              <h4>Total Stars</h4>
              <p>{data.totalStars}</p>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#888880",
                marginBottom: 16,
                fontWeight: 700,
              }}
            >
              Top Repositories
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {data.topRepos.length > 0 ? (
                data.topRepos.map((repo, i) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: 20,
                        minHeight: "180px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        borderRadius: "20px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(0,0,0,.3)";
                        e.currentTarget.style.borderColor = "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#818cf8",
                          marginBottom: 6,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {repo.name}
                      </div>
                      {repo.description && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#888880",
                            marginBottom: 12,
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                          }}
                        >
                          {repo.description}
                        </p>
                      )}
                      <div
                        style={{ display: "flex", gap: 12, marginTop: "auto" }}
                      >
                        {repo.language && (
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: "'Space Mono', monospace",
                              background: "rgba(99,102,241,0.2)",
                              color: "#c7d2fe",
                              borderRadius: "999px",
                              padding: "2px 8px",
                            }}
                          >
                            {repo.language}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: "#888880" }}>
                          ⭐ {repo.stars}
                        </span>
                        <span style={{ fontSize: 11, color: "#888880" }}>
                          ⑂ {repo.forks}
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#888880",
                  }}
                >
                  No repositories found
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* FOOTER */}
      {!data && !loading && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "2px solid #1a1a1a",
            padding: "12px 40px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "#888880",
              letterSpacing: 1,
            }}
          >
            Try: torvalds · gaearon · addyosmani · ASKAYSANCHIT
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "#888880",
            }}
          >
            Built with Next.js + GitHub API
          </span>
        </div>
      )}
    </div>
  );
}
