/**
 * Checks if a user has the specified privilege(s) for a module.
 *
 * @param userPrivileges - The user's granted privileges.
 * @param module - The privilege module to check against.
 * @param actions - A single action or an array of actions to check.
 * @param requireAll - If `true`, all actions must be present (AND logic).
 *                     If `false`, at least one action must be present (OR logic).
 *                     Defaults to `true`.
 * @returns `true` if the user has the required privileges, otherwise `false`.
 */
export function hasPrivilege(
  userPrivileges: Record<string, string[]>,
  module: string,
  actions: string | string[],
  requireAll: boolean = true,
): boolean {
  const allowedActions = userPrivileges[module] || [];
  const requiredActions = Array.isArray(actions) ? actions : [actions];

  return requireAll
    ? requiredActions.every((action) => allowedActions.includes(action))
    : requiredActions.some((action) => allowedActions.includes(action));
}
