import { useState, type FormEvent, type JSX } from "react";
import { useAppState } from "../../state/AppStateContext";
import { useOpenRef } from "../../hooks/useOpenRef";
import { parseRef } from "../../lib/refs";
import { STR } from "../../data/strings";
import { SearchIcon } from "../icons";
import styles from "./RefSearchForm.module.scss";

export function RefSearchForm(): JSX.Element {
  const { state } = useAppState();
  const t = STR[state.locale];
  const openRef = useOpenRef();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    if (!parseRef(value)) return;
    openRef(value);
    setValue("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.box}>
        <SearchIcon className={styles.icon} />
        <input
          className={styles.input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t.refPlaceholder}
        />
      </div>
    </form>
  );
}
