/** SectionHeading: shows the given text as a level 2 heading, optionally linkable by the given id. */
export function SectionHeading(props: { text: string; id?: string }) {
  return (
    <h2
      id={props.id}
      style={{
        fontSize: "var(--font-heading)",
        fontWeight: 700,
        color: "var(--color-text)",
        margin: 0,
      }}
    >
      {props.text}
    </h2>
  );
}
