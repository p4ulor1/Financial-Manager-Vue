export function getChartGradient(ctx, chartArea, topColor, bottomColor) {
  let width, height, gradient

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(1, topColor);
    gradient.addColorStop(0, bottomColor);
  }

  return gradient;
}