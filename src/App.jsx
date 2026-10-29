import { useState } from "react";
import Login from "./Login";
import "./App.css";

const initialJobs = [
  { id: "IMG-1042", name: "product-catalog.png", type: "Resize", status: "Completed", date: "Today, 10:42 AM", size: "2.4 MB" },
  { id: "IMG-1041", name: "profile-photo.jpg", type: "Compress", status: "Processing", date: "Today, 10:38 AM", size: "1.8 MB" },
  { id: "IMG-1040", name: "banner-design.webp", type: "Convert", status: "Completed", date: "Today, 10:25 AM", size: "4.1 MB" },
  { id: "IMG-1039", name: "event-poster.png", type: "Resize", status: "Failed", date: "Today, 10:12 AM", size: "3.6 MB" },
  { id: "IMG-1038", name: "thumbnail.jpg", type: "Compress", status: "Completed", date: "Today, 09:54 AM", size: "920 KB" },
];

// Demo data for the Processing Volume graph. Replace with real counts later.
const volumeData = [
  { day: "Mon", value: 480 },
  { day: "Tue", value: 720 },
  { day: "Wed", value: 560 },
  { day: "Thu", value: 900 },
  { day: "Fri", value: 1100 },
  { day: "Sat", value: 780 },
  { day: "Sun", value: 950 },
];

const navItems = [
  { id: "overview", icon: "◫", label: "Overview" },
  { id: "jobs", icon: "▤", label: "Processing Jobs" },
  { id: "logs", icon: "≡", label: "Activity Logs" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

function Icon({ children }) {
  return <span className="app-icon" aria-hidden="true">{children}</span>;
}

function Status({ status }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function Overview({ jobs, completed, processing, failed, setActivePage, createDemoJob }) {
  const successRate = jobs.length
    ? Math.round((completed / jobs.length) * 100)
    : 0;

  const progressFor = (status) => {
    if (status === "Completed") return 100;
    if (status === "Processing") return 68;
    return 35;
  };

  // Chart geometry: y axis runs 0..1200, x spreads evenly from 52 to 490
  const yFor = (value) => 185 - (value / 1200) * 160;
  const points = volumeData.map((d, i) => ({
    ...d,
    x: 52 + i * (438 / (volumeData.length - 1)),
    y: yFor(d.value),
  }));
  const linePath = points.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} 185 L ${points[0].x} 185 Z`;

  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">IMAGE PROCESSING WORKSPACE</div>
          <h1>Dashboard</h1>
          <p>Real-time overview of your image processing activity</p>
        </div>
        <div className="ai-engine-status">
          <span className="environment-dot" />
          Demo engine: <strong>Offline</strong>
        </div>
      </section>

      <section className="overview-grid">
        <article className="section-card overview-jobs">
          <div className="section-heading">
            <div className="overview-title">
              <span className="overview-heading-icon">▤</span>
              <h2>Processing Jobs</h2>
            </div>
            <button className="text-button" onClick={() => setActivePage("jobs")}>
              View all jobs →
            </button>
          </div>

          <div className="overview-table-wrap">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>IMAGE NAME</th>
                  <th>STATUS</th>
                  <th>PROGRESS</th>
                  <th>RESULT</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 6).map((job) => {
                  const progress = progressFor(job.status);

                  return (
                    <tr key={job.id}>
                      <td className="overview-job-id">{job.id}</td>
                      <td className="overview-file-name">{job.name}</td>
                      <td><Status status={job.status} /></td>
                      <td>
                        <div className="progress-cell">
                          <span>{progress}%</span>
                          <div className="progress-track">
                            <span style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        {job.status === "Completed" ? (
                          <span className="result-success">✓</span>
                        ) : job.status === "Failed" ? (
                          <span className="result-warning">!</span>
                        ) : (
                          <span className="result-pending">…</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="overview-card-footer">
            <span>Showing {Math.min(jobs.length, 6)} of {jobs.length} demo jobs</span>
            <button className="text-button" onClick={createDemoJob}>
              + New demo job
            </button>
          </div>
        </article>

        <article className="section-card pass-rate-card">
          <div className="section-heading">
            <div className="overview-title">
              <span className="overview-heading-icon">↗</span>
              <h2>Processing Success Rate</h2>
            </div>
            <span className="chart-info" title="Calculated from demo jobs">i</span>
          </div>

          <div className="pass-rate-content">
            <div
              className="pass-rate-ring"
              style={{ "--pass-rate": `${successRate}%` }}
            >
              <div className="pass-rate-inner">
                <strong>{successRate}<span>%</span></strong>
                <span>Successful jobs</span>
                <small>{completed} completed</small>
              </div>
            </div>
            <p>Percentage of demo image jobs that completed successfully.</p>
            <span className="demo-data-note">Sample data · Not connected to AWS</span>
          </div>
        </article>

        <article className="section-card checks-card">
          <div className="section-heading">
            <div className="overview-title">
              <span className="overview-heading-icon">◇</span>
              <h2>Image Validation Checks</h2>
            </div>
            <span className="small-badge">Demo</span>
          </div>

          {[
            { icon: "▦", title: "File format", description: "Check supported image extensions" },
            { icon: "↔", title: "Image dimensions", description: "Check image width and height" },
            { icon: "◉", title: "File size", description: "Check image size before processing" },
          ].map((check) => (
            <div className="check-row" key={check.title}>
              <span className="check-symbol">{check.icon}</span>
              <div className="check-description">
                <strong>{check.title}</strong>
                <span>{check.description}</span>
              </div>
              <span className="check-pass">PASS</span>
              <span className="result-success">✓</span>
            </div>
          ))}

          <div className="check-row">
            <span className="check-symbol warning-symbol">!</span>
            <div className="check-description">
              <strong>Processing errors</strong>
              <span>Review jobs marked as failed</span>
            </div>
            <span className={failed ? "check-warning" : "check-pass"}>
              {failed ? "REVIEW" : "CLEAR"}
            </span>
            <span className={failed ? "result-warning" : "result-success"}>
              {failed ? "!" : "✓"}
            </span>
          </div>

          <div className="overview-card-footer">
            <span>Illustrative checks, not real image validation.</span>
            <button className="text-button" onClick={() => setActivePage("logs")}>
              View activity →
            </button>
          </div>
        </article>

        <article className="section-card volume-card">
          <div className="section-heading">
            <div className="overview-title">
              <span className="overview-heading-icon">▥</span>
              <h2>Processing Volume</h2>
            </div>
            <span className="small-badge">7 Days · Demo</span>
          </div>

          <div className="volume-chart">
            <svg
              viewBox="0 0 520 235"
              role="img"
              aria-label="Illustrative image processing volume chart"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1fd1bd" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#1fd1bd" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {[1200, 900, 600, 300, 0].map((value) => (
                <g key={value}>
                  <line x1="48" y1={yFor(value)} x2="505" y2={yFor(value)} className="chart-grid-line" />
                  <text x="38" y={yFor(value) + 4} className="chart-axis-label" textAnchor="end">
                    {value.toLocaleString()}
                  </text>
                </g>
              ))}

              <path d={areaPath} fill="url(#volumeFill)" />
              <path d={linePath} className="chart-line" />

              {points.map((p) => (
                <circle key={p.day} cx={p.x} cy={p.y} r="4" className="chart-point">
                  <title>{`${p.day}: ${p.value} images`}</title>
                </circle>
              ))}

              {points.map((p) => (
                <text key={p.day} x={p.x} y="211" className="chart-axis-label" textAnchor="middle">
                  {p.day}
                </text>
              ))}
            </svg>
          </div>

          <div className="volume-summary">
            {[
              { label: "Total demo jobs", value: jobs.length },
              { label: "Completed", value: completed },
              { label: "Processing", value: processing },
              { label: "Failed", value: failed },
            ].map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="section-card services-card">
        <div className="section-heading">
          <div>
            <h2>AWS Service Integration</h2>
            <p>Planned components for the ImageCloud project</p>
          </div>
          <span className="small-badge">Not connected</span>
        </div>

        <div className="services-grid">
          <div className="service-item">
            <div className="service-logo s3-logo">S3</div>
            <div className="service-info">
              <strong>Amazon S3</strong>
              <span>Image storage</span>
            </div>
            <span className="service-status">Planned</span>
          </div>
          <div className="service-item">
            <div className="service-logo lambda-logo">λ</div>
            <div className="service-info">
              <strong>AWS Lambda</strong>
              <span>Image processing</span>
            </div>
            <span className="service-status">Planned</span>
          </div>
          <div className="service-item">
            <div className="service-logo cloudwatch-logo">◉</div>
            <div className="service-info">
              <strong>Amazon CloudWatch</strong>
              <span>Logs and monitoring</span>
            </div>
            <span className="service-status">Planned</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activities, setActivities] = useState([
    "Dashboard initialized",
    "Image processing service checked",
    "Sample processing jobs loaded",
  ]);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@imagecloud.demo",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [toast, setToast] = useState("");

  const completed = jobs.filter((job) => job.status === "Completed").length;
  const processing = jobs.filter((job) => job.status === "Processing").length;
  const failed = jobs.filter((job) => job.status === "Failed").length;

  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase();
    const matchesSearch =
      job.name.toLowerCase().includes(query) ||
      job.id.toLowerCase().includes(query) ||
      job.type.toLowerCase().includes(query);

    return matchesSearch && (filter === "All" || job.status === filter);
  });

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function addActivity(message) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setActivities((previous) => [`${timestamp} — ${message}`, ...previous]);
  }

  function createDemoJob() {
    const newJob = {
      id: `IMG-${1043 + jobs.length - initialJobs.length}`,
      name: `sample-image-${jobs.length + 1}.jpg`,
      type: "Resize",
      status: "Processing",
      date: "Just now",
      size: "1.2 MB",
    };

    setJobs((previous) => [newJob, ...previous]);
    addActivity(`New demo job created: ${newJob.name}`);
    notify("Demo processing job added");
    setActivePage("jobs");
  }

  function retryJob(jobId) {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === jobId ? { ...job, status: "Processing" } : job
      )
    );
    addActivity(`Retry requested for ${jobId}`);
    notify("Job marked as processing");
  }

  function logout() {
    setIsLoggedIn(false);
    setActivePage("overview");
    setSearch("");
    setFilter("All");
  }

  function saveProfile(event) {
    event.preventDefault();
    setProfile(profileDraft);
    setEditingProfile(false);
    addActivity("Profile details updated");
    notify("Profile updated");
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-symbol">☁</div>
          <div>
            <div className="brand-name">ImageCloud</div>
            <div className="brand-caption">SERVERLESS PROCESSING</div>
          </div>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "nav-item-active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
              {item.id === "jobs" && <span className="nav-count">{jobs.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="environment-card">
            <span className="environment-dot" />
            <div>
              <strong>Demo environment</strong>
              <span>AWS not connected</span>
            </div>
          </div>
          <button className="logout-button" onClick={logout}>
            <Icon>↪</Icon> Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{navItems.find((item) => item.id === activePage)?.label}</strong>
          </div>

          <div className="topbar-right">
            <span className="demo-label">
              <span className="environment-dot" /> Demo mode
            </span>
            <button
              className="profile-button"
              onClick={() => {
                setProfileDraft(profile);
                setEditingProfile(false);
                setActivePage("settings");
              }}
              aria-label="Open profile settings"
            >
              <span className="avatar">{profile.name.trim().charAt(0).toUpperCase() || "A"}</span>
              <span className="profile-button-text">
                <strong>{profile.name}</strong>
                <small>Administrator</small>
              </span>
              <span className="profile-chevron">⌄</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          {activePage === "overview" && (
            <Overview
              jobs={jobs}
              completed={completed}
              processing={processing}
              failed={failed}
              setActivePage={setActivePage}
              createDemoJob={createDemoJob}
            />
          )}

          {activePage === "jobs" && (
            <>
              <section className="page-heading">
                <div>
                  <div className="eyebrow">MONITORING</div>
                  <h1>Processing Jobs</h1>
                  <p>Search, inspect, and retry sample image jobs.</p>
                </div>
                <button className="primary-button" onClick={createDemoJob}>
                  ＋ New demo job
                </button>
              </section>

              <section className="section-card">
                <div className="job-toolbar">
                  <div className="search-box">
                    <span>⌕</span>
                    <input
                      type="search"
                      placeholder="Search by file, ID, or type..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                  <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter jobs by status">
                    <option>All</option>
                    <option>Completed</option>
                    <option>Processing</option>
                    <option>Failed</option>
                  </select>
                </div>

                <JobsTable jobs={filteredJobs} onRetry={retryJob} />
                <div className="table-footer">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </div>
              </section>
            </>
          )}

          {activePage === "logs" && (
            <>
              <section className="page-heading">
                <div>
                  <div className="eyebrow">OBSERVABILITY</div>
                  <h1>Activity Logs</h1>
                  <p>View events generated during this local demo session.</p>
                </div>
                <button className="secondary-button" onClick={() => {
                  setActivities([]);
                  notify("Activity log cleared");
                }}>
                  Clear logs
                </button>
              </section>

              <section className="section-card">
                <div className="section-heading">
                  <div>
                    <h2>Event history</h2>
                    <p>{activities.length} events recorded in this session</p>
                  </div>
                  <span className="small-badge">Local demo logs</span>
                </div>
                <ActivityList activities={activities} />
              </section>

              <div className="info-banner">
                <strong>Next step:</strong> After AWS integration, this page can display real application events and Lambda logs from Amazon CloudWatch.
              </div>
            </>
          )}

          {activePage === "settings" && (
            <>
              <section className="page-heading">
                <div>
                  <div className="eyebrow">PREFERENCES</div>
                  <h1>Settings</h1>
                  <p>Manage your demo profile and project information.</p>
                </div>
              </section>

              <section className="section-card settings-card">
                <div className="section-heading">
                  <div>
                    <h2>Profile information</h2>
                    <p>These changes apply to this browser session only.</p>
                  </div>
                  {!editingProfile && (
                    <button className="secondary-button" onClick={() => {
                      setProfileDraft(profile);
                      setEditingProfile(true);
                    }}>
                      Edit profile
                    </button>
                  )}
                </div>

                {editingProfile ? (
                  <form className="profile-form" onSubmit={saveProfile}>
                    <label htmlFor="profile-name">Display name</label>
                    <input
                      id="profile-name"
                      value={profileDraft.name}
                      onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })}
                      required
                    />
                    <label htmlFor="profile-email">Email address</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profileDraft.email}
                      onChange={(event) => setProfileDraft({ ...profileDraft, email: event.target.value })}
                      required
                    />
                    <div className="form-actions">
                      <button type="button" className="secondary-button" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </button>
                      <button className="primary-button" type="submit">Save changes</button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details">
                    <div className="settings-avatar">{profile.name.trim().charAt(0).toUpperCase() || "A"}</div>
                    <div>
                      <strong>{profile.name}</strong>
                      <p>{profile.email}</p>
                      <span className="small-badge">Administrator</span>
                    </div>
                  </div>
                )}
              </section>

              <section className="section-card">
                <div className="section-heading">
                  <div>
                    <h2>Project configuration</h2>
                    <p>Current frontend setup</p>
                  </div>
                </div>
                <div className="configuration-list">
                  <div><span>Application</span><strong>ImageCloud</strong></div>
                  <div><span>Environment</span><strong>Local development</strong></div>
                  <div><span>AWS region</span><strong>Not configured</strong></div>
                  <div><span>Authentication</span><strong>Demo login only</strong></div>
                </div>
              </section>
            </>
          )}

          <footer className="page-footer">
            <span>© 2026 ImageCloud</span>
            <span>Serverless Image Processing · Demo UI</span>
          </footer>
        </div>
      </main>

      {toast && <div className="toast-message">{toast}</div>}
    </div>
  );
}

function JobsTable({ jobs, onRetry }) {
  if (jobs.length === 0) {
    return <div className="empty-state">No jobs match your search.</div>;
  }

  return (
    <div className="table-scroll">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>FILE</th>
            <th>JOB ID</th>
            <th>TYPE</th>
            <th>STATUS</th>
            <th>SIZE</th>
            <th>DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <div className="file-cell">
                  <span className="file-icon">▧</span>
                  <strong>{job.name}</strong>
                </div>
              </td>
              <td className="job-id">{job.id}</td>
              <td>{job.type}</td>
              <td><Status status={job.status} /></td>
              <td>{job.size}</td>
              <td className="date-cell">{job.date}</td>
              <td>
                {job.status === "Failed" ? (
                  <button className="retry-button" onClick={() => onRetry(job.id)}>
                    Retry
                  </button>
                ) : (
                  <span className="no-action">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityList({ activities }) {
  if (activities.length === 0) {
    return <div className="empty-state">No activity events to display.</div>;
  }

  return (
    <div className="activity-list">
      {activities.map((activity, index) => (
        <div className="activity-item" key={`${activity}-${index}`}>
          <span className="activity-marker" />
          <span>{activity}</span>
        </div>
      ))}
    </div>
  );
}