const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../db.js');
const { capitalize } = require('../utils');
const makeJWT = require('../utils');
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('./jwt').SECRET_KEY;

const BASE_URL = process.env.BASE_URL;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * Funcion para determinar si user fue borrado, en caso true,
 * lo restora, de otra manera devuelve el mismo usuario
 * @param {user} user
 */

const checkAndRestoreUser = async (user) => {
  if (!user) {
    return null;
  }
  if (user.dataValues.deletedAt !== null) {
    const restored_user = await user.restore();
    return restored_user;
  } else {
    return await user;
  }
};

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  //*Estrategia para registro de un nuevo usuario
  passport.use(
    'register-local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const {
            firstName,
            lastName,
            email,
            birthdate,
            password,
            cellphone,
          } = req.body;
          const user_data = {
            firstName,
            lastName,
            email,
            birthdate,
            password,
            cellphone,
            isAdmin: false,
          };
          let user = await User.findOne({ where: { email }, paranoid: false });

          if (!user) {
            user = await User.create(user_data);
          } else if (user.dataValues.deletedAt !== null) {
            user = await user.restore();
            user = await user.update(user_data);
          } else {
            return done(null, false, { message: 'EL usuario ya existe' });
          }

          //clonamos el objeto user, eliminamos el campo password y devolvemos el obj user
          let user_obj = { ...user.dataValues };
          delete user_obj.password;
          return done(null, user_obj);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    /**
     * Estrategia para hacer login con email//pass
     * comparando contra la info de la db
     * devuelve un JWT para ser utilizado en la autenticacion con la estrategia JWT
     */
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
           return done(null, false, { message: 'No se encontro el usuario' });
          }
          const validate = await user.compare(password);
          if (!validate) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
          let user_obj = { ...user.dataValues };
          delete user_obj.password;
          return done(null, user_obj, { message: 'Login correcto' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  const cookieExtractor = (req) => {
    let token = null;
    if (req.signedCookies && req.signedCookies.refreshToken)
      token = req.signedCookies.refreshToken.token;
    return token;
  };

  //?Opciones de JWT
  const jwtCookies_options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: SECRET_KEY,
  };

  passport.use(
    'jwt-cookie',
    new JWTstrategy(jwtCookies_options, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({
          where: { email: jwt_payload.sub },
        });
        if (!user) {
          return done(null, false, {
            message: 'No se encontro el usuario',
          });
        }
        let user_obj = { ...user.dataValues };
        delete user_obj.password;
        return done(null, user_obj, { message: 'Token Autorizado' });
      } catch (error) {
        return done('CATCHING', error);
      }
    })
  );

  //?Opciones de JWT
  const jwt_options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
  };
  //*estrategia para login con JWT
  passport.use(
    'jwt',
    new JWTstrategy(jwt_options, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({
          where: { email: jwt_payload.user.email },
        });
        if (!user) {
          return done(null, false, { message: 'No se encontro el usuario' });
        }
        let user_obj = { ...user.dataValues };
        delete user_obj.password;
        return done(null, user_obj, { message: 'Token Autorizado' });
      } catch (error) {
        return done(error);
      }
    })
  );

  const refreshCookieExtractor = (req) => {
    let token = null;
    if (req.signedCookies && req.signedCookies.refreshToken)
      token = req.signedCookies.refreshToken.token;
    return token;
  };

  const jwtRefresh_options = {
    jwtFromRequest: refreshCookieExtractor,
    secretOrKey: SECRET_KEY,
  };
  //*Refresh strategy
  passport.use(
    'jwt-refresh',
    new JWTstrategy(jwtRefresh_options, async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload.user, { message: 'Token Autorizado' });
      } catch (error) {
        console.error('CATCHING REFRESH');
        return done(error);
      }
    })
  );
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: BASE_URL + 'auth/github/callback',
        passReqToCallback: true,
        scope: ['user:email'],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await User.findOne({ where: { email }, paranoid: false }); //buscamos el email que devuelve github
          // si no hay user entonces creamos uno con datos `default`
          // si encontramos un user, entonces solamente devolvemos ese user

          user = await checkAndRestoreUser(user);
          if (!user) {
            const { _json: extra, displayName } = profile;
            const [firstName, lastName] = displayName.split(/(?<=^\S+)\s/);
            const birthdate = new Date('01-01-1000');
            const password = String(Date.now() + Math.random()).substring(0, 7);
            const cellphone = 123456789;

            const user_data = {
              firstName,
              lastName: lastName || firstName,
              email,
              birthdate,
              password,
              cellphone,
              isAdmin: false,
            };

            const new_user = await User.create(user_data);
            if (!new_user)
              return done(null, false, {
                message: 'no se pudo crear el usuario',
              });
            user = new_user;
          }
          let user_obj = { ...user.dataValues, accessToken };
          delete user_obj.password;
          return done(null, user_obj);
        } catch (error) {
          return done('CATCHING', error);
        }
      }
    )
  );

  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: BASE_URL + 'auth/google/callback',
        passReqToCallback: true,
        // scope: ['email'],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await User.findOne({ where: { email }, paranoid: false }); //buscamos el email que devuelve github
          // si no hay user entonces creamos uno con datos `default`
          // si encontramos un user, entonces solamente devolvemos ese user

          user = await checkAndRestoreUser(user);

          if (!user) {
            const { _json: extra, displayName } = profile;
            const [firstName, lastName] = displayName.split(/(?<=^\S+)\s/);
            const birthdate = new Date('01-01-1500');
            const password = String(Date.now() + Math.random()).substring(0, 7);
            const cellphone = 987654321;
            const user_data = {
              firstName,
              lastName: lastName || firstName,
              email,
              birthdate,
              password,
              cellphone,
              isAdmin: false,
            };
            const new_user = await User.create(user_data);
            if (!new_user)
              return done(null, false, {
                message: 'no se pudo crear el usuario',
              });
            user = new_user;
          }
          let user_obj = { ...user.dataValues, accessToken };
          delete user_obj.password;
          return done(null, user_obj);
        } catch (error) {
          return done('CATCHING', error);
        }
      }
    )
  );
};
