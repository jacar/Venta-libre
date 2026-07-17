import Link from "next/link";

export default function PoliticasPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">Políticas de Venta Libre</h1>
        
        <div className="prose prose-blue max-w-none text-gray-700">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Política de Servicio y Envíos</h2>
            <p className="mb-4">
              En <strong>Venta Libre</strong>, nos comprometemos a brindar un servicio logístico de excelencia a nivel nacional en Colombia. Operamos bajo un modelo automatizado que nos permite seleccionar la transportadora más eficiente para tu ubicación.
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Cobertura Nacional:</strong> Realizamos envíos a más de 900 destinos en toda Colombia.</li>
              <li><strong>Pago Contra Entrega (COD):</strong> Para tu mayor seguridad y confianza, ofrecemos la modalidad de pago contra entrega. Paga el valor exacto de tu pedido en efectivo o con los métodos aceptados por la transportadora en el momento en que recibes el producto en la puerta de tu casa.</li>
              <li><strong>Tiempos de Entrega:</strong> Los tiempos de tránsito dependen de la ciudad de destino y de la transportadora asignada (generalmente entre 2 a 5 días hábiles). Recibirás notificaciones sobre el estado de tu pedido.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. Política de Privacidad</h2>
            <p className="mb-4">
              La protección de tus datos personales es una prioridad para <strong>Venta Libre</strong>.
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Recopilamos únicamente la información necesaria para procesar y entregar tu pedido (nombre, dirección, teléfono y correo electrónico).</li>
              <li>Tu información es compartida de manera segura exclusivamente con nuestros socios logísticos para garantizar la entrega de tu paquete.</li>
              <li>No comercializamos, alquilamos ni vendemos tu información personal a terceros bajo ninguna circunstancia.</li>
              <li>Al utilizar nuestro sitio web, aceptas el tratamiento de tus datos personales conforme a la ley colombiana de protección de datos (Ley 1581 de 2012).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. Política de Seguridad y Prevención de Fraude</h2>
            <p className="mb-4">
              <strong>Venta Libre</strong> implementa estrictas medidas para asegurar que cada transacción sea legítima y segura tanto para el comprador como para la tienda.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Validación de Pedidos:</strong> Todos los pedidos con opción de Pago Contra Entrega están sujetos a un proceso de verificación, que puede incluir un contacto telefónico o por WhatsApp para confirmar la autenticidad de la compra antes del despacho.</li>
              <li>En caso de detectar actividad inusual o sospechosa, nos reservamos el derecho de cancelar el pedido o solicitar información adicional para verificar la identidad del comprador.</li>
              <li>Nuestra plataforma está protegida con cifrado SSL para garantizar que tu navegación e ingreso de datos sean completamente seguros.</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <Link href="/" className="inline-flex justify-center bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
