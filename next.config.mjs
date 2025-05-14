let userConfig = undefined;
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import('./v0-user-next.config');
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

if (userConfig) {
  try {
    // ESM imports will have a "default" property
    const config = userConfig.default || userConfig;
    console.log("Array next.config.mjs");

    for (const key in config) {
      try {
        if (
          typeof nextConfig[key] === 'object' &&
          !Array.isArray(nextConfig[key])
        ) {
          nextConfig[key] = {
            ...nextConfig[key],
            ...config[key],
          };
        } else {
          nextConfig[key] = config[key];
        }
      } catch (innerError) {
        console.error(`Error al fusionar la clave: ${key}`, innerError);
        throw innerError; // Vuelve a lanzar el error para que se registre globalmente si es necesario
      }
    }

  } catch (error) {
    console.error("Error al procesar el archivo de configuración:", error);
  }
}

export default nextConfig;
