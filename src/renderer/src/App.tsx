import type { JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppStateProvider } from "./state/AppStateContext";
import { RootRedirect } from "./routes/RootRedirect";
import { ReaderPage } from "./routes/ReaderPage";

export default function App(): JSX.Element {
  return (
    <AppStateProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/read/:bookId/:chapter" element={<ReaderPage />} />
        <Route path="/read/:bookId/:chapter/:panel" element={<ReaderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppStateProvider>
  );
}
