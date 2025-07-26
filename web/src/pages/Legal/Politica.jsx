import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar useNavigate

export default function Politica() {
  const navigate = useNavigate(); // 2. Inicializar el hook

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
        <h1 className="text-3xl font-bold text-red-800 mb-4">Política de Privacidad</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            En Pa’ la Olla, valoramos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal al usar nuestra plataforma web o móvil.
          </p>
          
          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">1. Información que recopilamos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Datos personales:</strong> Nombre, dirección, correo electrónico y número de teléfono.</li>
            <li><strong>Información de pago:</strong> Esta información es procesada exclusivamente a través de PayPal. No almacenamos información de tarjetas de crédito o débito en nuestros servidores.</li>
            <li><strong>Historial de pedidos:</strong> Guardamos un registro de tus pedidos para facilitar futuras compras y ofrecerte un mejor servicio.</li>
            <li><strong>Datos de navegación:</strong> Recopilamos información que tu navegador envía cada vez que visitas nuestro servicio, como cookies, dirección IP, tipo de dispositivo y navegador.</li>
          </ul>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">2. Uso de la información</h2>
          <p>Utilizamos la información para:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Procesar pedidos y entregas.</li>
            <li>Mejorar la experiencia del usuario.</li>
            <li>Realizar sugerencias de recetas.</li>
            <li>Cumplir con obligaciones legales.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">3. Compartir información con terceros</h2>
          <p>Compartimos datos únicamente con:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>PayPal:</strong> Para procesar pagos.</li>
            <li><strong>Proveedores logísticos:</strong> Para realizar entregas de ingredientes.</li>
            <li>No vendemos ni alquilamos información personal a terceros.</li>
          </ul>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">4. Seguridad de la información</h2>
          <p>
            Limitamos el acceso a la información sensible solo al personal autorizado.
          </p>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">5. Derechos del usuario</h2>
          <p>Como usuario, tienes derecho a:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Acceder, corregir o eliminar sus datos.</li>
            <li>Solicitar la eliminación de su cuenta y todos los datos asociados.</li>
          </ul>

          <h2 className="text-xl font-semibold text-red-700 pt-4 border-t">6. Cambios a esta política</h2>
          <p>
            Nos reservamos el derecho de modificar esta política. Notificaremos a los usuarios por correo o mediante la plataforma.
          </p>

          <p className="font-semibold mt-8 pt-4 border-t">
            Fecha de entrada en vigor: 28 de Julio 2025
          </p>
        </div>
      </div>
    </div>
  );
}
