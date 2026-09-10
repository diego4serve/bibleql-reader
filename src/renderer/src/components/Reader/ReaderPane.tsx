import { useMemo, useRef, type JSX } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppState } from "../../state/AppStateContext";
import { usePassage } from "../../queries/usePassage";
import { useFocusVerse } from "../../hooks/useFocusVerse";
import { bookLabel, stepChapter } from "../../lib/refs";
import { STR } from "../../data/strings";
import { SAMPLE } from "../../data/sample";
import { NextIcon, PrevIcon } from "../icons";
import { ReaderColumn, type ColumnView } from "./ReaderColumn";
import styles from "./ReaderPane.module.scss";

interface ReaderPaneProps {
  compareEff: boolean;
}

export function ReaderPane({ compareEff }: ReaderPaneProps): JSX.Element {
  const { state } = useAppState();
  const t = STR[state.locale];
  const navigate = useNavigate();
  const { bookId = "PSA", chapter: chapterParam, panel = "ai" } = useParams();
  const chapter = Number(chapterParam) || 1;
  const [searchParams] = useSearchParams();
  const fromVerse = searchParams.get("from") ? Number(searchParams.get("from")) : null;
  const toVerse = searchParams.get("to") ? Number(searchParams.get("to")) : fromVerse;
  const noKey = !state.apiKey;

  const passageA = usePassage("a", state.transA, bookId, chapter);
  const passageB = usePassage("b", state.transB, bookId, chapter, state.compare);

  const colA: ColumnView = useMemo(() => {
    if (noKey) {
      return {
        label: `${bookLabel("PSA", state.locale)} 23 · ${state.locale === "es" ? "RV1909" : "WEB"}`,
        showLabel: true,
        loading: false,
        notice: t.noKey,
        verses: SAMPLE[state.locale].map((text, i) => ({ n: i + 1, text, hl: "off" as const }))
      };
    }
    const verses = (passageA.data?.verses ?? []).map((v) => ({
      n: v.verse,
      text: v.text,
      hl:
        fromVerse !== null && v.verse >= fromVerse && v.verse <= (toVerse ?? fromVerse)
          ? ("on" as const)
          : ("off" as const)
    }));
    return {
      label: passageA.data?.translationName || state.transA,
      showLabel: compareEff,
      loading: passageA.isLoading,
      notice: passageA.error?.message ?? "",
      verses
    };
  }, [noKey, passageA.data, passageA.isLoading, passageA.error, fromVerse, toVerse, compareEff, state.transA, state.locale, t.noKey]);

  const colB: ColumnView = useMemo(() => {
    // Faithful quirk: with no API key, the original only ever built a
    // sample/notice fallback for column A — column B just stays blank.
    if (noKey) return { label: state.transB, showLabel: true, loading: false, notice: "", verses: [] };
    const verses = (passageB.data?.verses ?? []).map((v) => ({
      n: v.verse,
      text: v.text,
      hl:
        fromVerse !== null && v.verse >= fromVerse && v.verse <= (toVerse ?? fromVerse)
          ? ("on" as const)
          : ("off" as const)
    }));
    return {
      label: passageB.data?.translationName || state.transB,
      showLabel: true,
      loading: passageB.isLoading,
      notice: passageB.error?.message ?? "",
      verses
    };
  }, [noKey, passageB.data, passageB.isLoading, passageB.error, fromVerse, toVerse, state.transB]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useFocusVerse(scrollRef, fromVerse, passageA.dataUpdatedAt);

  function goStep(dir: 1 | -1): void {
    const next = stepChapter(bookId, chapter, dir);
    if (!next) return;
    navigate(`/read/${next.bookId}/${next.chapter}/${panel}`);
  }

  const headingRef = `${bookLabel(bookId, state.locale)} ${chapter}`;
  const headingNote = compareEff
    ? ""
    : (passageA.data?.translationName ?? "") + (passageA.data?.translationNote ? ` · ${passageA.data.translationNote}` : "");

  return (
    <div className={styles.pane}>
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          <span className={styles.headingRef}>{headingRef}</span>
          <span className={styles.headingNote}>{headingNote}</span>
        </div>
        <div className={styles.navButtons}>
          <button type="button" className={styles.navButton} onClick={() => goStep(-1)} title={t.prev}>
            <PrevIcon />
          </button>
          <button type="button" className={styles.navButton} onClick={() => goStep(1)} title={t.next}>
            <NextIcon />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className={styles.scrollArea}>
        <div className={styles.columns}>
          <ReaderColumn column={colA} />
          {compareEff && <ReaderColumn column={colB} bordered />}
        </div>
      </div>
    </div>
  );
}
