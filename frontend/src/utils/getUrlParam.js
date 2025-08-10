export const getUrlParam = (paramName) => {
  // Get the query string from the URL (everything after '?')
  const queryString = window.location.search;

  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Get the requested parameter
  return urlParams.get(paramName);
}
