import { useQuery, keepPreviousData, type UseQueryResult } from "@tanstack/react-query";
import { useAppState } from "../state/AppStateContext";
import { gqlRequest } from "../lib/graphql";
import { refFor } from "../lib/refs";
import { queryKeys } from "./keys";
import type { PassageResult } from "../types/bible";

interface PassageResponse {
  passage: PassageResult | null;
}

const QUERY =
  "query($t:String!,$r:String!){ passage(translation:$t, reference:$r){ reference translationName translationNote verses { verse text } } }";

async function fetchPassage(apiKey: string, translationId: string, reference: string): Promise<PassageResult> {
  const data = await gqlRequest<PassageResponse>(apiKey, QUERY, { t: translationId, r: reference });
  const p = data.passage;
  return {
    reference: p?.reference ?? reference,
    translationName: p?.translationName ?? translationId,
    translationNote: p?.translationNote ?? "",
    verses: p?.verses ?? []
  };
}

// `slot` isn't part of the cache key — identity is translationId+bookId+chapter,
// so two columns showing the same translation+location correctly share one
// cached fetch. It exists only for callsite clarity:
// usePassage("a", transA, ...) / usePassage("b", transB, ...).
export function usePassage(
  slot: "a" | "b",
  translationId: string,
  bookId: string,
  chapter: number,
  enabled: boolean = true
): UseQueryResult<PassageResult> {
  void slot;
  const { state } = useAppState();
  return useQuery({
    queryKey: queryKeys.passage(translationId, bookId, chapter),
    queryFn: () => fetchPassage(state.apiKey, translationId, refFor(translationId, bookId, chapter)),
    enabled: enabled && !!state.apiKey && !!translationId && !!bookId,
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData
  });
}
