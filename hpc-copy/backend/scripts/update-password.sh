#!/bin/bash

username="$1"
newpassword="$2"

# Check if all parameters are provided
if [ -z "$username" ] || [ -z "$newpassword" ]; then
  echo "Usage: $0 <username> <newpassword>"
  exit 1
fi

# Update system user's password
echo "$username:$newpassword" | chpasswd

if [ $? -ne 0 ]; then
  echo "Failed to update system password for user $username."
  exit 1
fi

LDAP_BASE_DN="dc=aura,dc=hpc,dc=org"
LDAP_USER_DN="uid=$username,ou=users,$LDAP_BASE_DN"
LDAP_ADMIN_DN="cn=Manager,$LDAP_BASE_DN"
LDAP_ADMIN_PASSWORD="secret"

# Create the LDIF file for modifying the user's password
cat <<EOF > /tmp/$username-password.ldif
dn: $LDAP_USER_DN
changetype: modify
replace: userPassword
userPassword: $newpassword
EOF

# Apply the LDIF modifications
ldapmodify -x -D "$LDAP_ADMIN_DN" -w "$LDAP_ADMIN_PASSWORD" -f /tmp/$username-password.ldif

# Check if ldapmodify was successful
if [ $? -eq 0 ]; then
  echo "Password for LDAP user $username has been updated successfully."
else
  echo "Failed to update password for LDAP user $username."
fi

# Clean up the temporary LDIF file
rm /tmp/$username-password.ldif
