import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAppState } from "../state/AppStateContext";
import { gqlRequest } from "../lib/graphql";
import { queryKeys } from "./keys";

interface ConcordanceSupportResponse {
  translation: { concordanceIndexedAt: string | null } | null;
}

const QUERY = "query($i:String!){ translation(identifier:$i){ concordanceIndexedAt } }";

async function fetchConcordanceIndexedAt(apiKey: string, translationId: string): Promise<string | null> {
  const data = await gqlRequest<ConcordanceSupportResponse>(apiKey, QUERY, { i: translationId });
  return data.translation?.concordanceIndexedAt ?? null;
}

// Concordance only answers for translations BibleQL has indexed — checked
// separately from the actual lookup so re-submitting the same word doesn't
// re-check support every time.
export function useConcordanceSupport(translationId: string): UseQueryResult<string | null> {
  const { state } = useAppState();
  return useQuery({
    queryKey: queryKeys.concordanceSupport(translationId),
    queryFn: () => fetchConcordanceIndexedAt(state.apiKey, translationId),
    enabled: !!state.apiKey && !!translationId,
    staleTime: 10 * 60_000
  });
}
