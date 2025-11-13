interface WavyDividerProps {
  /** Color of the top section (defaults to white) */
  topColor?: string
  /** Color of the bottom section (defaults to muted) */
  bottomColor?: string
  /** Height of the wave in pixels */
  height?: number
  /** Whether to flip the wave direction */
  flipped?: boolean
}

function WavyDivider({
  topColor = "var(--background)",
  bottomColor = "var(--muted)",
  height = 60,
  flipped = false,
}: WavyDividerProps) {
  const generateSineWave = (isMobile = false) => {
    const points = []
    const amplitude = isMobile ? height * 0.15 : height * 0.3
    const frequency = 2
    const steps = 100

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 1000
      const y = amplitude * Math.sin((i / steps) * frequency * 2 * Math.PI) + height / 2
      points.push(`${x},${flipped ? height - y : y}`)
    }

    const pathStart = flipped ? `M0,${height}` : `M0,0`
    const pathCurve = `L${points.join(" L")}`
    const pathEnd = flipped ? `L1000,${height} L0,${height} Z` : `L1000,${height} L0,${height} Z`

    return `${pathStart} ${pathCurve} ${pathEnd}`
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      {/* Top section background */}
      <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: topColor }} />

      <svg
        className="hidden md:block absolute bottom-0 w-full h-full"
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={generateSineWave(false)} fill={bottomColor} />
      </svg>

      <svg
        className="block md:hidden absolute bottom-0 w-full h-full"
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={generateSineWave(true)} fill={bottomColor} />
      </svg>
    </div>
  )
}

export { WavyDivider }
export default WavyDivider
