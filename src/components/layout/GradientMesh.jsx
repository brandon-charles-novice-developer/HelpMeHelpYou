// GradientMesh — animated gradient background underlay for glassmorphism effect
// 3 large blurred blobs drift slowly to create organic movement

export default function GradientMesh() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: '#1E1A2E',
      }}
    >
      {/* Purple blob — center left */}
      <div
        className="mesh-blob mesh-blob-1"
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          top: '10%',
          left: '-5%',
          borderRadius: '50%',
          background: 'rgba(77, 65, 118, 0.4)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Indigo blob — upper right */}
      <div
        className="mesh-blob mesh-blob-2"
        style={{
          position: 'absolute',
          width: '45vw',
          height: '45vw',
          top: '-10%',
          right: '-10%',
          borderRadius: '50%',
          background: 'rgba(92, 112, 214, 0.25)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Deep blob — bottom center */}
      <div
        className="mesh-blob mesh-blob-3"
        style={{
          position: 'absolute',
          width: '55vw',
          height: '40vw',
          bottom: '-15%',
          left: '25%',
          borderRadius: '50%',
          background: 'rgba(45, 40, 80, 0.35)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
