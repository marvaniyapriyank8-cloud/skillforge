import { Fragment } from 'react';

/**
 * Renders the plain/markdown-ish text returned by the AI endpoints as real
 * headings, lists and bold text. Built from React elements (no innerHTML),
 * so model output can never inject markup.
 */

const inline = (text, keyBase) =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={`${keyBase}-${i}`} className="font-semibold text-fg">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return <code key={`${keyBase}-${i}`} className="rounded bg-subtle px-1 py-0.5 text-[0.9em] text-fg">{part.slice(1, -1)}</code>;
    return <Fragment key={`${keyBase}-${i}`}>{part}</Fragment>;
  });

const parse = (raw) => {
  const blocks = [];
  let list = null;

  const flush = () => {
    if (list) blocks.push(list);
    list = null;
  };

  String(raw ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .forEach((line) => {
      if (!line.trim()) return flush();

      const heading = line.match(/^\s*#{1,6}\s+(.*)$/);
      const boldOnly = line.match(/^\s*\*\*([^*]+?)\*\*:?\s*$/);
      const numbered = line.match(/^(\s*)(\d+)[.)]\s+(.*)$/);
      const bullet = line.match(/^(\s*)[-*•]\s+(.*)$/);

      if (heading || boldOnly) {
        flush();
        blocks.push({ type: 'heading', text: (heading ? heading[1] : boldOnly[1]).replace(/\*\*/g, '') });
      } else if (numbered || bullet) {
        const ordered = Boolean(numbered);
        const [, indent, , text] = numbered || [null, bullet[1], null, bullet[2]];
        if (!list || list.ordered !== ordered) {
          flush();
          list = { type: 'list', ordered, items: [] };
        }
        list.items.push({ text: numbered ? numbered[3] : text, nested: indent.length >= 2 });
      } else {
        flush();
        blocks.push({ type: 'p', text: line.trim() });
      }
    });
  flush();
  return blocks;
};

export const AiOutput = ({ text }) => (
  <div className="space-y-3 text-sm leading-relaxed text-fg-muted">
    {parse(text).map((block, i) => {
      if (block.type === 'heading')
        return <h3 key={i} className="pt-2 text-sm font-semibold text-fg first:pt-0">{inline(block.text, i)}</h3>;
      if (block.type === 'p') return <p key={i}>{inline(block.text, i)}</p>;
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag key={i} className={`space-y-1.5 pl-5 ${block.ordered ? 'list-decimal' : 'list-disc'} marker:text-fg-subtle`}>
          {block.items.map((item, j) => (
            <li key={j} className={item.nested ? 'ml-4' : undefined}>{inline(item.text, `${i}-${j}`)}</li>
          ))}
        </Tag>
      );
    })}
  </div>
);
