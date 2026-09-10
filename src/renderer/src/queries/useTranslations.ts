import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAppState } from "../state/AppStateContext";
import { gqlRequest } from "../lib/graphql";
import { queryKeys } from "./keys";
import type { TranslationSummary } from "../types/bible";

interface TranslationsResponse {
  translations: TranslationSummary[];
}

const QUERY = "query { translations { identifier name language note concordanceIndexedAt } }";

async function fetchTranslations(apiKey: string): Promise<TranslationSummary[]> {
  const data = await gqlRequest<TranslationsResponse>(apiKey, QUERY);
  return (data.translations || []).slice().sort((a, b) => a.identifier.localeCompare(b.identifier));
}

export function useTranslations(): UseQueryResult<TranslationSummary[]> {
  const { state } = useAppState();
  return useQuery({
    queryKey: queryKeys.translations(),
    queryFn: () => fetchTranslations(state.apiKey),
    enabled: !!state.apiKey,
    staleTime: Infinity,
    // The original silently swallows a failed fetch and keeps the fallback list.
    retry: false
  });
}
