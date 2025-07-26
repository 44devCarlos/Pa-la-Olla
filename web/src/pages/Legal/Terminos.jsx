import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar useNavigate

export default function Terminos() {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8">
        {/* 3. Cambiar Link por un botón con navigate(-1) */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-red-800 mb-6"
        >
          &larr; Volver
        </button>
        <h1 className="text-3xl font-bold text-red-800 mb-4">Términos y Condiciones</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Al acceder o utilizar la plataforma Pa’ la Olla, aceptas los siguientes Términos y Condiciones:
          </p>
          
          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">1. Uso de la plataforma</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Solo las personas mayores de 18 años pueden realizar pedidos.</li>
            <li>El usuario se compromete a proporcionar información veraz y actualizada al momento de registrarse y realizar un pedido.</li>
          </ul>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">2. Proceso de pedidos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Los pedidos de ingredientes se generan al seleccionar una receta y proceder a la compra.</li>
            <li>El pago se efectúa exclusivamente mediante PayPal y se rige por sus propios términos y condiciones.</li>
            <li>Es responsabilidad del usuario verificar que la dirección de entrega sea correcta antes de confirmar el pedido.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">3. Reembolsos y cancelaciones</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Una vez que un pedido ha sido confirmado y procesado, no se aceptan cancelaciones.</li>
            <li>Si el pedido llega incompleto o con ingredientes en mal estado, el usuario podrá solicitar una revisión y un posible reembolso parcial. Esta solicitud debe realizarse dentro de las 24 horas posteriores a la entrega.</li>
          </ul>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">4. Disponibilidad del servicio</h2>
          <p>
            La plataforma puede no estar disponible temporalmente debido a mantenimientos programados o fallas técnicas inesperadas. Pa’ la Olla no garantiza la disponibilidad continua e ininterrumpida del servicio.
          </p>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">5. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar funcionalidades, precios o los presentes términos sin previo aviso. Cualquier cambio relevante será comunicado a los usuarios de forma oportuna a través de la plataforma o por correo electrónico.
          </p>
          
          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">6. Ley aplicable</h2>
          <p>
            Este acuerdo y el uso de la plataforma se rigen por las leyes de la República de Panamá. Cualquier disputa será sometida a la jurisdicción de los tribunales competentes de dicho país.
          </p>

          <p className="font-semibold mt-8 pt-4 border-t">
            Fecha de entrada en vigor: 28 de Julio 2025
          </p>
        </div>
      </div>
    </div>
  );
}
