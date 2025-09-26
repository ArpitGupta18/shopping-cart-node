import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URI,
} from "./env.js";

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK_URI,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await User.findOne({
					where: { email: profile.emails[0].value },
				});

				if (user) {
					if (user.provider === "google") {
						return done(null, user);
					} else {
						return done(null, false, {
							message: "already_registered",
						});
					}
				}

				user = await User.create({
					name: profile.displayName,
					email: profile.emails[0].value,
					password: null,
					role: "user",
					provider: "google",
					isVerified: true,
				});

				return done(null, user);
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

export default passport;
