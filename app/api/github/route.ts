import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
    ]);

    if (!userRes.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Language breakdown
    const languages: Record<string, number> = {};
    repos.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Top repos by stars
    const topRepos = repos
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((repo: any) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        description: repo.description,
        url: repo.html_url,
      }));

    return NextResponse.json({
      user: {
        name: user.name || username,
        login: user.login,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        location: user.location,
        company: user.company,
        blog: user.blog,
        created_at: user.created_at,
      },
      languages: Object.entries(languages)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
      topRepos,
      totalStars: repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0),
      totalForks: repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
