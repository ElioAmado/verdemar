// LegalNotice.jsx
// React component (JSX) containing the legal notice text provided by the user.
// Comments are in English, following user's preference.

import React from 'react';

/**
 * LegalNotice
 *
 * Stateless presentational component that renders the legal notice (LSSI) for the website.
 * Tailwind CSS utility classes are used for responsive layout and typography.
 */
export default function LegalNotice() {
  return (
    <article className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md prose lg:prose-lg">
      <h1>Ley de los Servicios de la Sociedad de la Información (LSSI)</h1>

      <p>
        <strong>ISABEL COSTA CARDONA</strong>, responsable del sitio web, en adelante <strong>RESPONSABLE</strong>, pone a disposición de los usuarios el presente documento, con el que pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), BOE N.º 166, así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso. Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso de las disposiciones aquí dispuestas, así como a cualquier otra disposición legal que fuera de aplicación.
      </p>

      <p>
        <strong>ISABEL COSTA CARDONA</strong> se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones, entendiéndose como suficiente la publicación en el sitio web.
      </p>

      <section>
        <h2>1. Datos identificativos</h2>
        <ul>
          <li><strong>Nombre de dominio:</strong> apartamentosverdemar-formentera.com</li>
          <li><strong>Nombre comercial:</strong> VERDE MAR APARTAMENTOS</li>
          <li><strong>Denominación social:</strong> ISABEL COSTA CARDONA</li>
          <li><strong>NIF:</strong> 41454245B</li>
          <li><strong>Domicilio social:</strong> Camino Punta Prima, s/n , 07871 San Fernando – Formentera (ILLES BALEARS)</li>
          <li><strong>Teléfono:</strong> 626703985</li>
          <li><strong>E-mail:</strong> <a href="mailto:aptosverdemar@gmail.com">aptosverdemar@gmail.com</a></li>
        </ul>
      </section>

      <section>
        <h2>2. Derechos de propiedad intelectual e industrial</h2>
        <p>
          El sitio web, incluyendo su programación, edición, compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos, texto y gráficos, son propiedad del RESPONSABLE o dispone de licencia/autorización expresa de los autores. Todos los contenidos están protegidos por normativa de propiedad intelectual e industrial.
        </p>
        <p>
          La reproducción total o parcial, uso, explotación, distribución y comercialización requiere autorización escrita previa. Cualquier uso no autorizado se considera incumplimiento grave.
        </p>
        <p>
          Los contenidos ajenos al RESPONSABLE pertenecen a sus respectivos propietarios. El RESPONSABLE autoriza redirección directa a contenidos concretos del sitio web principal. La mención de contenidos no implica responsabilidad, respaldo, patrocinio o recomendación.
        </p>
        <p>
          Para observaciones sobre posibles incumplimientos de derechos de propiedad intelectual o industrial, puede contactar a: <a href="mailto:aptosverdemar@gmail.com">aptosverdemar@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2>3. Exención de responsabilidades</h2>
        <p>
          El RESPONSABLE se exime de responsabilidad derivada de información publicada si fue manipulada o introducida por terceros. Este sitio puede usar cookies técnicas para funciones imprescindibles; no recopilan datos personales sin consentimiento.
        </p>
        <p>
          Se pueden usar cookies para mejorar la navegación, recordar usuarios registrados y medir audiencia. El usuario puede configurar su navegador para alertas de cookies e impedir su instalación.
        </p>

        <h3>Política de enlaces</h3>
        <p>
          El sitio web puede redirigir a contenidos de terceros. El RESPONSABLE no asume responsabilidad por esos contenidos y actuará para retirar cualquier contenido que contravenga la legislación, moral o el orden público.
        </p>

        <h3>Direcciones IP</h3>
        <p>
          Los servidores pueden detectar automáticamente la dirección IP y nombre de dominio del usuario. Esta información se registra para procesarla estadísticamente y medir visitas, impresiones de página y tráfico.
        </p>
      </section>

      <section>
        <h2>4. Ley aplicable y jurisdicción</h2>
        <p>
          Para la resolución de controversias o cuestiones relacionadas con este sitio web se aplicará la legislación española, siendo competentes los Juzgados y Tribunales más cercanos a San Fernando – Formentera.
        </p>
      </section>
    </article>
  );
}
