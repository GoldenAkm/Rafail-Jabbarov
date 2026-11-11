import DecodeText from "./DecodeText";

type Props = { index: string; title: string; note?: string };

export default function SectionHead({ index, title, note }: Props) {
  return (
    <div className="section-head">
      <span className="section-head__index">{index}</span>
      <DecodeText as="h2" text={title} />
      <span className="section-head__rule" aria-hidden="true" />
      {note && <span className="section-head__note">{note}</span>}
    </div>
  );
}
