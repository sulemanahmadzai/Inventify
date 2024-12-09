export const analyticsService = {
  async fetchAnalyticsData(timeRange = "weekly") {
    const response = await fetch(
      `http://localhost:3000/api/analytics?timeRange=${timeRange}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }
    return response.json();
  },

  async fetchInventoryData({
    timeRange = "weekly",
    search,
    sortField,
    sortOrder,
    category,
    limit,
    skip,
  } = {}) {
    const urlParams = new URLSearchParams();
    urlParams.set("timeRange", timeRange);

    if (search) urlParams.set("search", search);
    if (sortField) urlParams.set("sortField", sortField);
    if (sortOrder) urlParams.set("sortOrder", sortOrder);
    if (category) urlParams.set("category", category);
    if (typeof limit !== "undefined") urlParams.set("limit", limit);
    if (typeof skip !== "undefined") urlParams.set("skip", skip);

    const response = await fetch(
      `http://localhost:3000/api/analytics?${urlParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }
    return response.json();
  },
};
