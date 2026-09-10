import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import { useAppState } from "../state/AppStateContext";
import { gqlRequest } from "../lib/graphql";
import { queryKeys } from "./keys";
import type { ConcordanceEntry, ConcordanceHitNode } from "../types/bible";

export interface ConcordancePageResult {
  totalCount: number;
  entry: ConcordanceEntry | null;
  hits: ConcordanceHitNode[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

interface ConcordanceResponse {
  concordance: {
    totalCount: number;
    entry: ConcordanceEntry | null;
    edges: { node: ConcordanceHitNode }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

const QUERY =
  "query($t:String!,$w:String!,$a:String){ concordance(translation:$t, word:$w, first:25, after:$a){ totalCount entry { surfaceForms totalOccurrences verseCount occurrencesByTestament { old new } } edges { node { context verse { bookName chapter verse } } } pageInfo { hasNextPage endCursor } } }";

async function fetchConcordancePage(
  apiKey: string,
  translationId: string,
  word: string,
  after: string | null
): Promise<ConcordancePageResult> {
  const data = await gqlRequest<ConcordanceResponse>(apiKey, QUERY, { t: translationId, w: word, a: after });
  const c = data.concordance;
  return {
    totalCount: c.totalCount,
    entry: c.entry,
    hits: (c.edges || []).map((edge) => edge.node),
    pageInfo: c.pageInfo ?? { hasNextPage: false, endCursor: null }
  };
}

export function useConcordance(
  translationId: string,
  word: string,
  enabled: boolean
): UseInfiniteQueryResult<InfiniteData<ConcordancePageResult>> {
  const { state } = useAppState();
  return useInfiniteQuery({
    queryKey: queryKeys.concordance(translationId, word),
    queryFn: ({ pageParam }) => fetchConcordancePage(state.apiKey, translationId, word, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (last.pageInfo.hasNextPage ? last.pageInfo.endCursor : undefined),
    enabled: enabled && !!state.apiKey && !!word,
    retry: false
  });
}
