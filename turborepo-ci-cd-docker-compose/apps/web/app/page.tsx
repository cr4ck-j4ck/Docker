import styles from "./page.module.css";
import { prismaClient } from "@devops/prisma";

export const dynamic = "force-dynamic";

type UserRecord = {
  id: number;
  username: string;
  password: string;
};

const formatMaskedSecret = (secret: string) => {
  const maskLength = Math.max(8, Math.min(secret.length, 18));

  return `${"•".repeat(maskLength)} ${secret.length} chars`;
};

const getInitials = (username: string) => username.slice(0, 2).toUpperCase();

const loadUsers = async () => {
  try {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return { users, error: null as null | string };
  } catch (error) {
    console.error("Failed to load users", error);

    return {
      users: [] as UserRecord[],
      error:
        "The database query did not complete. Check your Prisma connection and try again.",
    };
  }
};

export default async function Home() {
  const { users, error } = await loadUsers();
  const totalUsers = users.length;
  const averageUsernameLength = totalUsers
    ? Math.round(
        users.reduce((sum, user) => sum + user.username.length, 0) / totalUsers,
      )
    : 0;
  const longestSecret = users.reduce(
    (max, user) => Math.max(max, user.password.length),
    0,
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Next.js x Prisma x Postgres</p>
          <h1 className={styles.title}>User intelligence, rendered live from your database.</h1>
          <p className={styles.description}>
            This page is a server component that reads directly from Prisma and turns
            the result into a polished operational view. Clean data, fast rendering,
            zero placeholder fluff.
          </p>
          <div className={styles.pills}>
            <span>Server-rendered</span>
            <span>Workspace package import</span>
            <span>Real database query</span>
          </div>
        </div>

        <aside className={styles.metricsCard}>
          <div className={styles.metricsHeader}>
            <span className={styles.metricsLabel}>Live snapshot</span>
            <span className={styles.signal}>
              <span className={styles.signalDot} />
              Prisma online
            </span>
          </div>

          <div className={styles.metricGrid}>
            <article className={styles.metricTile}>
              <span>Total users</span>
              <strong>{totalUsers}</strong>
            </article>
            <article className={styles.metricTile}>
              <span>Avg username</span>
              <strong>{averageUsernameLength} chars</strong>
            </article>
            <article className={styles.metricTile}>
              <span>Longest secret</span>
              <strong>{longestSecret} chars</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.sectionEyebrow}>User registry</p>
            <h2 className={styles.sectionTitle}>All users fetched through Prisma</h2>
          </div>
          <div className={styles.panelMeta}>
            <span>{totalUsers} records</span>
            <span>Ordered by ID</span>
          </div>
        </div>

        {error ? (
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Query failed</span>
            <p>{error}</p>
          </div>
        ) : totalUsers === 0 ? (
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>No users yet</span>
            <p>
              Your Prisma query worked, but the `User` table is empty right now. Seed
              a few rows and they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className={styles.tableShell}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>ID</th>
                  <th>Password footprint</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.avatar}>{getInitials(user.username)}</span>
                        <div>
                          <strong>{user.username}</strong>
                          <p>Workspace account</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className={styles.inlineCode}>{user.username}</code>
                    </td>
                    <td>#{user.id}</td>
                    <td>{formatMaskedSecret(user.password)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
