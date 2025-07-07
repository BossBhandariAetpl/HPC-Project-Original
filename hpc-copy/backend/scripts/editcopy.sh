username="$1"
loginshell="$2"
shadowinactive="$3"
shadowlastchange="$4"
shadowmax="$5"
shadowmin="$6"
$shadowwarning="$7"
$oldusername="$8"

LDAP_BASE_DN="dc=aura,dc=hpc,dc=org"
LDAP_USER_DN="uid=$oldusername,ou=users,$LDAP_BASE_DN"
LDAP_GROUP_DN="cn=$oldusername,ou=groups,$LDAP_BASE_DN"
LDAP_ADMIN_DN="cn=Manager,$LDAP_BASE_DN"
LDAP_ADMIN_PASSWORD="secret"

# Check if username and password are provided
if [ -z "$username" ] || [ -z "$loginshell" ]|| [ -z "$shadowinactive" ]|| [ -z "$shadowlastchange" ]|| [ -z "$shadowmax" ]|| [ -z "$shadowmin" ]|| [ -z "$shadowarning" ]; then
  echo "Usage: $0 <username> <loginshell> <shadowinactive> <shadowlastchange> <shadowmax> <shadowmin> <shadowwarning>"
  exit 1
fi


# Change the username on the system
# usermod -l $username $oldusername

# Create the LDIF file for modifying the user
cat <<EOF > /tmp/$username.ldif
dn: $LDAP_USER_DN
changetype: modify
replace: uid
uid: $username

dn: $LDAP_USER_DN
changetype: modify
replace: cn
cn: $username

dn: $LDAP_USER_DN
changetype: modify
replace: sn
sn: $username

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
shadowWarning: $shadowarning

dn: $LDAP_USER_DN
changetype: modify
replace: shadowInactive
shadowInactive: $shadowinactive

dn: $LDAP_USER_DN
changetype: modify
replace: shadowLastChange
shadowLastChange: $shadowlastchange

dn: $LDAP_GROUP_DN
changetype: modify
replace: cn
cn: $username

dn: $LDAP_GROUP_DN
changetype: modify
replace: memberUid
memberUid: $username
EOF

# Apply the LDIF modifications
ldapmodify -x -D "$LDAP_ADMIN_DN" -w "$LDAP_ADMIN_PASSWORD" -f /tmp/$username.ldif

# Clean up the temporary LDIF file
rm /tmp/$username.ldif

echo "LDAP user $username has been updated."