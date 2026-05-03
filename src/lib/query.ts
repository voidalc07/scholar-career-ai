export const buildOpportunityQuery = (search: string, educationLevel: string): string => {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (educationLevel.trim()) params.set("educationLevel", educationLevel.trim());
  const query = params.toString();
  return query ? `?${query}` : "";
};
