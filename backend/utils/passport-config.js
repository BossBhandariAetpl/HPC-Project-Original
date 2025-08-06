import passport from 'passport';
import { Strategy as LdapStrategy } from 'passport-ldapauth';

const OPTS = {
    server: {
        url: 'ldap://aura.hpc.org',
        bindDN: 'cn=Manager,dc=aura,dc=hpc,dc=org',
        bindCredentials: 'secret',
        searchBase: 'ou=users,dc=aura,dc=hpc,dc=org',
        searchFilter: '(uid={{username}})'
    },
    passReqToCallback: true
};

passport.use(new LdapStrategy(OPTS));

export default passport;