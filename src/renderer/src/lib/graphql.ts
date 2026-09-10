export const DEFAULT_ENDPOINT = "https://bibleql.org/graphql";

export class GraphQLRequestError extends Error {}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function gqlRequest<T>(
  apiKey: string,
  query: string,
  variables?: Record<string, unknown>,
  endpoint: string = DEFAULT_ENDPOINT
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables: variables ?? {} })
    });
  } catch {
    throw new GraphQLRequestError(
      `The request to ${endpoint} failed before a reply came back — a server error, a rate limit, or a blocked cross-origin request. Try again in a moment.`
    );
  }

  if (res.status === 401 || res.status === 403) {
    throw new GraphQLRequestError("The API key was rejected (401/403).");
  }

  const json: GraphQLResponse<T> | null = await res.json().catch(() => null);
  if (!json) throw new GraphQLRequestError("The API returned a response that was not JSON.");
  if (json.errors?.length) throw new GraphQLRequestError(json.errors[0].message);
  return json.data as T;
}
