export const calculateRollingAvg = (data: { currentPrice: number; currentShares: number; boughtShares: number; boughtPrice: number }) => {
  const prev = data.currentPrice * data.currentShares
  const post = data.boughtPrice * data.boughtShares
  const denom = data.currentShares + data.boughtShares

  return (prev + post) / denom
}
