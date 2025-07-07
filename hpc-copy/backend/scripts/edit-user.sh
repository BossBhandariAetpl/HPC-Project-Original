#!/bin/bash

username="$1"
loginshell="$2"
shadowinactive="$3"
shadowlastchange="$4"
shadowmax="$5"
shadowmin="$6"
shadowwarning="$7"

# Check if all parameters are provided
if [ -z "$username" ] || [ -z "$loginshell" ] || [ -z "$shadowinactive" ] || [ -z "$shadowlastchange" ] || [ -z "$shadowmax" ] || [ -z "$shadowmin" ] || [ -z "$shadowwarning" ]; then
  echo "Usage: $0 <username> <loginshell> <shadowinactive> <shadowlastchange> <shadowmax> <shadowmin> <shadowwarning>"
  exit 1
fi

LDAP_BASE_DN="dc=aura,dc=hpc,dc=org"
LDAP_USER_DN="uid=$username,ou=users,$LDAP_BASE_DN"
LDAP_ADMIN_DN="cn=Manager,$LDAP_BASE_DN"
LDAP_ADMIN_PASSWORD="secret"

# Create the LDIF file for modifying the user
cat <<EOF > /tmp/$username.ldif
dn: $LDAP_USER_DN
changetype: modify
replace: loginShell
loginShell: $loginshell

dn: $LDAP_USER_DN
changetype: modify
replace: homeDirectory
homeDirectory: /home/$username

dn: $LDAP_USER_DN
changetype: modify
replace: shadowMax
shadowMax: $shadowmax

dn: $LDAP_USER_DN
changetype: modify
replace: shadowMin
shadowMin: $shadowmin

dn: $LDAP_USER_DN
changetype: modify
replace: shadowWarning
shadowWarning: $shadowwarning

dn: $LDAP_USER_DN
changetype: modify
replace: shadowInactive
shadowInactive: $shadowinactive

dn: $LDAP_USER_DN
changetype: modify
replace: shadowLastChange
shadowLastChange: $shadowlastchange
EOF

# Apply the LDIF modifications
ldapmodify -x -D "$LDAP_ADMIN_DN" -w "$LDAP_ADMIN_PASSWORD" -f /tmp/$username.ldif

# Check if ldapmodify was successful
if [ $? -eq 0 ]; then
  echo "LDAP user $username has been updated successfully."
else
  echo "Failed to update LDAP user $username."
fi

# Clean up the temporary LDIF file
rm /tmp/$username.ldif
