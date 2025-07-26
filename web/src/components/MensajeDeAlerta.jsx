export default function MensajeDeAlerta({ contenido, estilo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`rounded-lg p-6 shadow-lg transition-all duration-300 ${estilo}`}>
        {contenido}
      </div>
    </div>
  );
}
