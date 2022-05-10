/* Importa las funciones de gulp. */
const { src, dest, watch, parallel } = require(`gulp`);

//HTML
const htmlMin = require("gulp-htmlmin");

//CSS
const autoprefixer = require(`autoprefixer`);
const cssnano = require(`cssnano`);
const postcss = require(`gulp-postcss`);
const sourcemaps = require(`gulp-sourcemaps`);
const clean = require(`gulp-purgecss`);

//PLUMBER
const plumber = require(`gulp-plumber`);

//IMAGENES
const cache = require(`gulp-cache`);
const imgMin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const avif = require(`gulp-avif`);

/* Concatena todos los archivos CSS en un solo archivo. */
const concat = require(`gulp-concat`);
//CACHE-BUST
const cacheBust = require(`gulp-cache-bust`);

//HTML
function html(done) {
  const options = {
    collapseWhitespace: true,
    removeComments: true,
  };
  const cache = {
    type: `timestamp`,
  };

  src("src/views/**/*.html")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(htmlMin(options))
    .pipe(cacheBust(cache))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest("public/"));

  done();
}

//CSS
function css(done) {
  src(`src/styles/**/*.css`) //Identificar el archivo sass a compilar
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat(`styles.css`))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/styles`)); //Almacenar en el disco duro

  done();
}

function cleanCSS(done) {
  const content = {
    content: [`public/*.html`],
  };

  src(`public/styles/styles.css`)
    .pipe(clean(content))
    .pipe(dest(`public/styles`));

  done();
}

//IMAGENES
function img(done) {
  const options = {
    optimizationLevel: 3,
  };

  src(`src/assets/img/**/*.{png,jpg,svg}`)
    .pipe(plumber())
    .pipe(cache(imgMin(options)))
    .pipe(dest(`public/assets/img`));

  done();
}

function vWebp(done) {
  const options = {
    quality: 50,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(webp(options))
    .pipe(dest(`public/assets/img`));

  done();
}

function vAvif(done) {
  const options = {
    quality: 50,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(avif(options))
    .pipe(dest(`public/assets/img`));

  done();
}

function dev(done) {
  watch(`src/views/**/*.html`, html);
  watch(`src/styles/**/*.css`, css);
  watch(`src/assets/img/**/*.{png,jpg,svg}`, img);

  done();
}

exports.html = html;
exports.css = css;
exports.clean = cleanCSS;
exports.img = img;
exports.vWebp = vWebp;
exports.vAvif = vAvif;
exports.dev = parallel(img, vWebp, vAvif, dev);
