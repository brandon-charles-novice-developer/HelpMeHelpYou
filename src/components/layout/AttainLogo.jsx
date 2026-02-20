export default function AttainLogo({ height = 24, variant = 'white' }) {
  const src = variant === 'white'
    ? `${import.meta.env.BASE_URL}attain-logo-white.png`
    : `${import.meta.env.BASE_URL}attain-logo-black.png`

  return (
    <img
      src={src}
      alt="Attain"
      height={height}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}
