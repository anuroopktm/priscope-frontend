import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";

import { BaseApiError } from "@/shared/utils/api/api-core";

/**
 * Creates a typed query hook with default error type as ApiError.
 *
 * @param key Query key array
 * @param queryFn The function to fetch data
 * @param options Optional react-query options
 */
export function createQuery<TData, TError = BaseApiError>(
  key: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,
    ...options,
  });
}

/**
 * Creates a typed mutation hook with default error type as ApiError.
 *
 * @param mutationFn The function to mutate data
 * @param options Optional react-query mutation options
 */
export function createMutation<
  TData,
  TVariables = void,
  TError = BaseApiError
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    retry: false,
    ...options,
  });
}
