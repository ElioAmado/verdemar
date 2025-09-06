// CookiesPolicy.jsx
// React component (JSX) containing the cookie policy text provided by the user.
// Comments are in English, following the user's preference for English docstrings.

import { SiteFooter } from '@/components/site-footer';
import React from 'react';

import { SiteHeader } from '@/components/site-header';
/**
 * CookiesPolicy
 *
 * Stateless presentational component that renders the cookie policy text.
 * Uses Tailwind CSS utility classes for layout and typography.
 */
export default function CookiesPolicy() {
  return (
    <div className="flex min-h-screen flex-col">
            <SiteHeader />
    <article className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md prose lg:prose-lg">
      <h1>Política de cookies</h1>

      <section>
        <h2>Información sobre cookies</h2>
        <p>
          Debido a la entrada en vigor de la referente modificación de la «Ley de Servicios de la Sociedad de la Información"
          (LSSICE) establecida por el Real Decreto 13/2012, es de obligación obtener el consentimiento expreso del usuario de
          todas las páginas web que usan cookies prescindibles, antes de que este navegue por ellas.
        </p>

        <h3>¿Qué son las cookies?</h3>
        <p>
          Las cookies y otras tecnologías similares tales como local shared objects, flash cookies o píxeles, son herramientas
          empleadas por los servidores Web para almacenar y recuperar información acerca de sus visitantes, así como para ofrecer
          un correcto funcionamiento del sitio.
        </p>
        <p>
          Mediante el uso de estos dispositivos se permite al servidor Web recordar algunos datos concernientes al usuario, como
          sus preferencias para la visualización de las páginas de ese servidor, nombre y contraseña, productos que más le
          interesan, etc.
        </p>

        <h3>Cookies afectadas por la normativa y cookies exceptuadas</h3>
        <p>
          Según la directiva de la UE, las cookies que requieren el consentimiento informado por parte del usuario son las
          cookies de analítica y las de publicidad y afiliación, quedando exceptuadas las de carácter técnico y las necesarias
          para el funcionamiento del sitio web o la prestación de servicios expresamente solicitados por el usuario.
        </p>
      </section>

      <section>
        <h2>Tipos de cookies</h2>

        <h3>Según la finalidad</h3>
        <ul>
          <li>
            <strong>Cookies técnicas y funcionales:</strong> permiten la navegación y el uso de las distintas opciones o servicios
            del sitio.
          </li>
          <li>
            <strong>Cookies analíticas:</strong> permiten el seguimiento y análisis del comportamiento de los usuarios para
            medir la actividad y elaborar perfiles de navegación con el fin de mejorar el servicio.
          </li>
          <li>
            <strong>Cookies publicitarias:</strong> gestionan los espacios publicitarios para mostrar anuncios en función del
            contenido o la frecuencia.
          </li>
          <li>
            <strong>Cookies de publicidad comportamental:</strong> recogen información sobre preferencias del usuario (retargeting).
          </li>
          <li>
            <strong>Cookies sociales:</strong> establecidas por plataformas de redes sociales para permitir compartir contenido.
          </li>
          <li>
            <strong>Cookies de afiliados:</strong> hacen seguimiento de visitas procedentes de otras webs con contrato de afiliación.
          </li>
          <li>
            <strong>Cookies de seguridad:</strong> almacenan información cifrada para proteger los datos frente a ataques.
          </li>
        </ul>

        <h3>Según la propiedad</h3>
        <ul>
          <li>
            <strong>Cookies propias:</strong> enviadas desde un dominio gestionado por el editor del sitio.
          </li>
          <li>
            <strong>Cookies de terceros:</strong> enviadas desde un dominio gestionado por otra entidad diferente al editor.
          </li>
        </ul>

        <h3>Según el plazo de conservación</h3>
        <ul>
          <li>
            <strong>Cookies de sesión:</strong> recaban y almacenan datos mientras el usuario accede a la página web.
          </li>
          <li>
            <strong>Cookies persistentes:</strong> permanecen almacenadas y pueden ser accedidas durante un período definido por
            el responsable, que puede ir de minutos a varios años.
          </li>
        </ul>
      </section>

      <section>
        <h2>Tratamiento de datos personales</h2>
        <p>
          <strong>ISABEL COSTA CARDONA</strong> es el Responsable del tratamiento de los datos personales del Interesado y le
          informa de que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de
          abril de 2016 (GDPR), por lo que se le facilita la siguiente información del tratamiento:
        </p>
        <ul>
          <li><strong>Fines del tratamiento:</strong> según se especifica en el apartado de cookies que se utilizan en este sitio web.</li>
          <li><strong>Legitimación del tratamiento:</strong> por consentimiento del interesado (art. 6.1 GDPR).</li>
          <li><strong>Criterios de conservación:</strong> según se especifica en el apartado de cookies utilizadas en la web.</li>
          <li><strong>Comunicación de los datos:</strong> no se comunicarán los datos a terceros, excepto en cookies propiedad de terceros o por obligación legal.</li>
        </ul>

        <h3>Derechos que asisten al Interesado</h3>
        <ul>
          <li>Derecho a retirar el consentimiento en cualquier momento.</li>
          <li>Derecho de acceso, rectificación, portabilidad y supresión de sus datos, y de limitación u oposición a su tratamiento.</li>
          <li>Derecho a presentar una reclamación ante la Autoridad de control (www.aepd.es) si considera que el tratamiento no se ajusta a la normativa vigente.</li>
        </ul>

        <p><strong>Datos de contacto para ejercer sus derechos:</strong></p>
        <address>
          ISABEL COSTA CARDONA.<br />
          Camino Punta Prima, s/n, – 07871 San Fernando – Formentera (Illes Balears).<br />
          E-mail: <a href="mailto:aptosverdemar@gmail.com">aptosverdemar@gmail.com</a>
        </address>
      </section>

      <section>
        <h2>Cookies utilizadas en este sitio web</h2>

        <h3>Cookies controladas por el editor</h3>
        <p><strong>Técnicas y funcionales</strong></p>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-3 py-2 text-left">Propiedad</th>
              <th className="border px-3 py-2 text-left">Cookie</th>
              <th className="border px-3 py-2 text-left">Finalidad</th>
              <th className="border px-3 py-2 text-left">Plazo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-3 py-2">apartamentosverdemar-formentera.com</td>
              <td className="border px-3 py-2">pll_language</td>
              <td className="border px-3 py-2">Cookie necesaria para la utilización de las opciones y servicios del sitio web</td>
              <td className="border px-3 py-2">2 meses</td>
            </tr>
          </tbody>
        </table>

        <h3>Cookies de terceros</h3>
        <p>
          Los servicios de terceros son ajenos al control del editor. Los proveedores pueden modificar en todo momento sus
          condiciones de servicio, finalidad y utilización de las cookies, etc.
        </p>
        <p><strong>Proveedores externos de este sitio web:</strong> No se instalan cookies controladas por terceros.</p>

        <h3>Panel de configuración de cookies</h3>
        <p>
          Desde este panel podrá configurar las cookies que el sitio web puede instalar en su navegador, excepto las cookies
          técnicas o funcionales que son necesarias para la navegación y la utilización de las diferentes opciones o servicios
          que se ofrecen.
        </p>

        <h3>Cómo gestionar las cookies desde el navegador</h3>
        <p>
          <strong>Eliminar las cookies del dispositivo:</strong> Las cookies que ya están en un dispositivo se pueden eliminar
          borrando el historial del navegador, con lo que se suprimen las cookies de todos los sitios web visitados. Sin embargo,
          también se puede perder parte de la información guardada (por ejemplo, los datos de inicio de sesión o las
          preferencias de sitio web).
        </p>
        <p>
          <strong>Gestionar las cookies específicas del sitio:</strong> Para tener un control más preciso de las cookies específicas
          de cada sitio, los usuarios pueden ajustar su configuración de privacidad y cookies en el navegador.
        </p>
        <p>
          <strong>Bloquear las cookies:</strong> Aunque la mayoría de los navegadores modernos se pueden configurar para evitar que
          se instalen cookies en los dispositivos, eso puede obligar al ajuste manual de determinadas preferencias cada vez que
          se visite un sitio o página. Además, algunos servicios y características pueden no funcionar correctamente.
        </p>

        <h3>Cómo eliminar las cookies de los navegadores más comunes</h3>
        <ul>
          <li>Chrome: http://support.google.com/chrome/answer/95647?hl=es</li>
          <li>Internet Explorer. Versión 11: https://support.microsoft.com/es-es/help/278835/how-to-delete-cookie-files-in-internet-explorer</li>
          <li>Firefox. Versión 65.0.1: https://www.mozilla.org/es-ES/privacy/websites/#cookies</li>
          <li>Safari Versión 5.1: https://support.apple.com/es-es/guide/safari/sfri11471/mac</li>
          <li>Opera: https://help.opera.com/en/latest/security-and-privacy/#clearBrowsingData</li>
        </ul>
      </section>
    </article>
    <SiteFooter />
    </div>
  );
}
