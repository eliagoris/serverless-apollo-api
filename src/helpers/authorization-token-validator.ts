export const getIsAuthorizationTokenValid = (token: string): boolean => {
  const hasAuthorizationHeader = !!token
  const isFormattedCorrectly = token?.toLowerCase().startsWith("bearer ")

  return hasAuthorizationHeader && isFormattedCorrectly
}
