import DecodeText from "@/components/DecodeText";
import Panel from "@/components/Panel";
import SectionHead from "@/components/SectionHead";
import StatusBar from "@/components/StatusBar";
import { experience, profile, projects, skills } from "@/data/profile";

export default function Home() {
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <StatusBar />

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="hero__meta">
            <span className="tag tag--live">Available // {profile.availability.term}</span>
            <span className="muted">{profile.location}</span>
          </div>
          <DecodeText as="h1" className="hero__name" text={profile.name.toUpperCase()} speed={45} />
          <p className="hero__role">
            {profile.role} <span className="muted">@</span> {profile.school}
          </p>
          <p className="hero__tagline">{profile.tagline}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">
              View projects
            </a>
            <a className="btn" href={profile.resume} target="_blank" rel="noopener">
              Resume.pdf
            </a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              Contact
            </a>
          </div>

          <dl className="readout">
            <div>
              <dt>Program</dt>
              <dd>{profile.degree}</dd>
            </div>
            <div>
              <dt>Grad</dt>
              <dd>{profile.graduation}</dd>
            </div>
            <div>
              <dt>Co-op</dt>
              <dd>{profile.availability.length}</dd>
            </div>
            <div>
              <dt>Relocate</dt>
              <dd>{profile.availability.relocate}</dd>
            </div>
          </dl>
        </section>

        {/* Profile */}
        <section id="profile" className="section">
          <SectionHead index="01" title="OPERATOR PROFILE" note="ID verified" />
          <div className="grid-2">
            <Panel label="Bio" code="BIO.TXT">
              {profile.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Panel>
            <Panel label="Coursework" code="UVIC">
              <ul className="list-ticks">
                {profile.coursework.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Panel>
          </div>
        </section>

        {/* Skills */}
        <section id="modules" className="section">
          <SectionHead index="02" title="INSTALLED MODULES" note={`${skills.reduce((n, g) => n + g.items.length, 0)} loaded`} />
          <div className="grid-3">
            {skills.map((group) => (
              <Panel key={group.id} label={group.label} code={`MOD/${group.id}`}>
                <ul className="skills">
                  {group.items.map((s) => (
                    <li key={s.name}>
                      <span>{s.name}</span>
                      <span className="meter" role="img" aria-label={`${s.level} of 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < s.level ? "on" : ""} />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section">
          <SectionHead index="03" title="PROJECT FILES" note={`${projects.length} records`} />
          <div className="grid-2">
            {projects.map((p) => (
              <article key={p.code} className="project">
                <Panel label={p.code} code={p.date}>
                  <h3>{p.title}</h3>
                  <p className="project__summary">{p.summary}</p>
                  <ul className="list-ticks">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="chips">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  {p.link && (
                    <a className="project__link" href={p.link} target="_blank" rel="noopener">
                      Open repository →
                    </a>
                  )}
                </Panel>
              </article>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="log" className="section">
          <SectionHead index="04" title="SERVICE LOG" />
          <ol className="timeline">
            {experience.map((r) => (
              <li key={r.title}>
                <div className="timeline__when">{r.period}</div>
                <Panel label={r.org} code={r.place}>
                  <h3>{r.title}</h3>
                  <ul className="list-ticks">
                    {r.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </Panel>
              </li>
            ))}
          </ol>
        </section>

        {/* Contact */}
        <section id="contact" className="section">
          <SectionHead index="05" title="OPEN CHANNEL" note="Secure link" />
          <Panel className="contact" label="Transmission" code="TX-READY">
            <p>
              Looking for a {profile.availability.term} placement, {profile.availability.length}. Happy to relocate to{" "}
              {profile.availability.relocate}.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="btn" href={profile.github} target="_blank" rel="noopener">
                github.com/{profile.githubHandle}
              </a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">
                LinkedIn
              </a>
            </div>
          </Panel>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="muted">Built with Next.js // Victoria, BC</span>
      </footer>
    </>
  );
}
