import React from 'react';
import styles from './Admin.module.scss';

const Admin: React.FC = () => {
  // Mock data - in a real MERN app, this comes from your Express API
  const stats = [
    { label: 'Total Users', value: '1,250' },
    { label: 'Revenue', value: '$12,400' },
    { label: 'Active Sessions', value: '42' }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>MERN Admin</div>
        <nav>
          <ul>
            <li className={styles.active}>Home</li>
            <li>Analytics</li>
            <li>Users</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h1>Dashboard Overview</h1>
          <div className={styles.userProfile}>JS</div>
        </header>

        <section className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <span>{stat.label}</span>
              <h3>{stat.value}</h3>
            </div>
          ))}
        </section>

        <section className={styles.tableArea}>
          <h2>Recent Activity</h2>
          <div className={styles.dummyTable}>
            {/* Table or List content goes here */}
            <p>Fetching latest data from MongoDB...</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;