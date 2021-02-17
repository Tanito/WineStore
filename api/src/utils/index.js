const SECRET_KEY = require('../config/jwt.js').SECRET_KEY;
const jwt = require('jsonwebtoken');

const refreshTime = 60 * 5 * 1000;

const extractDigitsFromString = (str) => {
  //* func que recibe la string del search input y devuelve un objeto
  //* que contiene un array de palabras y un array de numeros
  //* str<String> => <{digits:null|[...],words:null|[...]}>
  if (typeof str !== 'string') return null;
  let words, digits;
  let search = {
    digits: null,
    words: null,
  };
  const digitPattern = /(\d+)/g;
  const letterPattern = /(\D+)/g;

  digits = str.match(digitPattern, str);
  if (digits) {
    search.digits = digits.map((number) => Number(number));
  }

  words = str.match(letterPattern, '');
  if (words) {
    search.words = words
      .map((word) => {
        let w = word.trim();
        if (w.length > 0) return w;
      })
      .filter((word) => !!word);
  }

  return search;
};
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const makeJWT = (user, expiresIn, prefix) => {
  /**
   * func para crear un jw token
   * recibe user y devuelve un token con la info del user
   */
  const { id } = user;

  const options = {
    expiresIn: expiresIn || refreshTime,
  };
  const payload = {
    id,
    user,
    iat: Date.now(),
    issuer: 'wineStore',
    audience: 'localhost:3000',
  };

  const signedToken = jwt.sign(payload, SECRET_KEY, options);

  if (typeof prefix !== 'undefined') {
    return {
      token: prefix + ' ' + signedToken,
      expires: options.expiresIn,
    };
  } else {
    return {
      token: signedToken,
      expires: options.expiresIn,
    };
  }
};

const cookieMaker = (name, token, res) => {
  let cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: true,
  };
  return res.cookie(name, token, cookieOptions);
};

exports.extractDigitsFromString = extractDigitsFromString;
exports.capitalize = capitalize;
exports.makeJWT = makeJWT;
exports.cookieMaker = cookieMaker;
exports.refreshTime = refreshTime;
