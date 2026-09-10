import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAppState } from "../state/AppStateContext";
import { gqlRequest } from "../lib/graphql";
import { queryKeys } from "./keys";
import type { SearchHit } from "../types/bible";

interface SearchResponse {
  search: SearchHit[];
}

const QUERY =
  "query($t:String!,$q:String!){ search(translation:$t, query:$q, limit:40){ bookName chapter verse text } }";

async function fetchSearch(apiKey: string, translationId: string, query: string): Promise<SearchHit[]> {
  const data = await gqlRequest<SearchResponse>(apiKey, QUERY, { t: translationId, q: query });
  return data.search ?? [];
}

export function useSearch(translationId: string, query: string, enabled: boolean): UseQueryResult<SearchHit[]> {
  const { state } = useAppState();
  return useQuery({
    queryKey: queryKeys.search(translationId, query),
    queryFn: () => fetchSearch(state.apiKey, translationId, query),
    enabled: enabled && !!state.apiKey && !!query,
    retry: false
  });
}
