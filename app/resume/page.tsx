import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Backdrop from "@/components/Backdrop";
import Panel from "@/components/Panel";
import PdfViewer from "@/components/PdfViewer";
import SectionHead from "@/components/SectionHead";
import StatusBar from "@/components/StatusBar";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Resume — ${profile.name}`,
  description: `Resume of ${profile.name}, ${profile.role} at the ${profile.school}.`,
};

export default async function ResumePage() {
  // Inline the PDF into the page so no separate .pdf request is made;
  // download-manager extensions intercept those and the viewer gets nothing.
  const pdf = await readFile(path.join(process.cwd(), "public", profile.resume));
  const data = pdf.toString("base64");

  return (
    <>
      <Backdrop />
      <StatusBar />

      <main id="top">
        <section className="section">
          <SectionHead index="//" title="RESUME" note="Updated Nov 2026" />
          <Panel label="Document" code="RESUME.PDF">
            <PdfViewer data={data} title={`${profile.name} resume`} />
          </Panel>
          <div className="hero__actions">
            <a className="btn" href="/">
              ← Back to home
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
