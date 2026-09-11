import type { JSX } from "react";
import { useAppState } from "../../state/AppStateContext";
import { STR } from "../../data/strings";
import { CompareIcon, KeyIcon, MoonIcon, StudyIcon, SunIcon } from "../icons";
import { RefSearchForm } from "./RefSearchForm";
import styles from "./TitleBar.module.scss";

export function TitleBar(): JSX.Element {
  const { state, actions } = useAppState();
  const t = STR[state.locale];
  const platform = window.desktop.platform;
  const isMac = platform === "darwin";
  const isWin = platform === "win32";
  const isDark = state.theme === "dark";

  return (
    <div className={styles.bar}>
      {isMac && (
        <div className={styles.trafficLights}>
          <span className={styles.trafficLight} style={{ background: "#e8695e" }} />
          <span className={styles.trafficLight} style={{ background: "#e0b040" }} />
          <span className={styles.trafficLight} style={{ background: "#67bd52" }} />
        </div>
      )}

      <div className={styles.wordmark}>
        <span className={styles.title}>Bible Reader</span>
        <span className={styles.kicker}>BibleQL</span>
      </div>

      <RefSearchForm />

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.toolButton}
          data-active={state.compare}
          title={t.compare}
          onClick={actions.toggleCompare}
        >
          <CompareIcon />
          <span>{t.compare}</span>
        </button>
        <button
          type="button"
          className={styles.toolButton}
          data-active={state.panelOpen}
          title={t.panel}
          onClick={actions.togglePanel}
        >
          <StudyIcon />
          <span>{t.panel}</span>
        </button>
        <span className={styles.divider} />
        <button type="button" className={styles.localeButton} title="Language" onClick={actions.toggleLocale}>
          {state.locale === "es" ? "ES" : "EN"}
        </button>
        <button type="button" className={styles.iconButton} title={t.theme} onClick={actions.toggleTheme}>
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button type="button" className={styles.iconButton} title={t.aiApiKey} onClick={actions.openKeyDialog}>
          <KeyIcon />
        </button>
        {isWin && (
          <div className={styles.winCaption}>
            <span className={styles.winButton}>–</span>
            <span className={styles.winButton} style={{ fontSize: 11 }}>
              ▢
            </span>
            <span className={styles.winButton}>✕</span>
          </div>
        )}
      </div>
    </div>
  );
}
