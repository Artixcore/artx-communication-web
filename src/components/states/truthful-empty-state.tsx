export function TruthfulEmptyState({ title, body }: { title: string; body: string }) {
  return <section className="artx-empty"><p className="artx-kicker">Current state</p><h2>{title}</h2><p>{body}</p></section>
}
