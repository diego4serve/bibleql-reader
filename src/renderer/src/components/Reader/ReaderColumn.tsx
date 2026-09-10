import type { JSX } from "react";
import { Spinner } from "../Spinner";
import { VerseList } from "./VerseList";
import styles from "./ReaderColumn.module.scss";

export interface ColumnVerse {
  n: number;
  text: string;
  hl: "on" | "off";
}

export interface ColumnView {
  label: string;
  showLabel: boolean;
  loading: boolean;
  notice: string;
  verses: ColumnVerse[];
}

interface ReaderColumnProps {
  column: ColumnView;
  bordered?: boolean;
}

export function ReaderColumn({ column, bordered = false }: ReaderColumnProps): JSX.Element {
  return (
    <div className={bordered ? `${styles.column} ${styles.bordered}` : styles.column}>
      {column.showLabel && <div className={styles.label}>{column.label}</div>}
      {column.loading && (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      )}
      {column.notice && <div className={styles.notice}>{column.notice}</div>}
      <VerseList verses={column.verses} />
    </div>
  );
}
