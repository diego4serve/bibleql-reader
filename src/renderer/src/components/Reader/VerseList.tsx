import type { JSX } from "react";
import type { ColumnVerse } from "./ReaderColumn";
import styles from "./VerseList.module.scss";

interface VerseListProps {
  verses: ColumnVerse[];
}

export function VerseList({ verses }: VerseListProps): JSX.Element {
  return (
    <div className={styles.wrap}>
      {verses.map((v) => (
        <p key={v.n} data-verse={v.n} data-hl={v.hl} className={styles.verse}>
          <sup className={styles.verseNumber}>{v.n}</sup>
          {v.text}
        </p>
      ))}
    </div>
  );
}
