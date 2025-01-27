const webpack = require('webpack');

const MOMENT_DESIRED_LOCALES = Object.freeze([
  'es'
]);
const REGEX_MOMENT_LOCALE_CONTEXT = /[\\|/]moment[\\|/]locale$/;
const REGEX_MOMENT_LOCALE_RESOURCE = /\.\.[\\|/]moment$/
const REGEX_MOMENT_LOCALE_RESOURCES = MOMENT_DESIRED_LOCALES.map(str => new RegExp(`[\\|/]${str}(\.[j|t]s)?$`, 'gi'));


module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
      // No es necesario, dado que la versión de webpack ya se
      // encarga de hacer el control con las expresiones regulares.
      // checkResource: (resource, context) => {
      //     // Para reducir el tamaño de la aplicación, este
      //     // algortirmo excluye idiomas de traducción que no
      //     // se encuentran en `MOMENT_DESIRED_LOCALES`.

      //     // Se ignora el archivo si...
      //     const isIgnored =
      //         // ...es parte de los locales de moment
      //         REGEX_MOMENT_LOCALE_CONTEXT.test(context)
      //         // ...no es la importación base de moment
      //         && !REGEX_MOMENT_LOCALE_RESOURCE.test(resource)
      //         // ...no es alguno de los idiomas que queremos usar en el proyecto
      //         && !REGEX_MOMENT_LOCALE_RESOURCES.some(re => re.test(resource));

      //     return isIgnored;
      // },
    }),
  ]
}
