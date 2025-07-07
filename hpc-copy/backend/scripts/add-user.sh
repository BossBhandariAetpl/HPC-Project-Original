#!/bin/bash

# Function to add user to both system and LDAP
add_system_and_ldap_user() {
    local username=$1
    local password=$2

    # Add user to the system
    useradd -m -s /bin/bash "$username"
    echo "$username:$password" | chpasswd

    if [ $? -ne 0 ]; then
        echo "Failed to add system user $username."
        exit 1
    fi

    # Define LDAP details
    LDAP_BASE_DN="dc=aura,dc=hpc,dc=org"
    LDAP_USER_DN="uid=$username,ou=users,$LDAP_BASE_DN"
    LDAP_GROUP_DN="cn=$username,ou=groups,$LDAP_BASE_DN"
    LDAP_ADMIN_DN="cn=Manager,$LDAP_BASE_DN"
    LDAP_ADMIN_PASSWORD="secret"

    # Prepare LDIF file for adding user
    cat <<EOF > /tmp/$username.ldif
dn: $LDAP_USER_DN
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: $username
cn: $username
sn: $username
loginShell: /bin/bash
uidNumber: $(id -u $username)
gidNumber: $(id -g $username)
homeDirectory: /home/$username
userPassword: $password
shadowMax: 99999
shadowMin: 1
shadowWarning: 7
shadowInactive: 7
shadowLastChange: 99999

dn: $LDAP_GROUP_DN
objectClass: posixGroup
cn: $username
gidNumber: $(id -g $username)
memberUid: $username
EOF

    # Add user to LDAP
    ldapadd -x -D "$LDAP_ADMIN_DN" -w "$LDAP_ADMIN_PASSWORD" -f /tmp/$username.ldif

    if [ $? -eq 0 ]; then
        echo "System and LDAP user $username added successfully."
    else
        echo "Failed to add LDAP user $username."
        exit 1
    fi

    # Clean up temporary file
    rm -f /tmp/$username.ldif
}

# Main script execution
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root." 1>&2
    exit 1
fi

add_system_and_ldap_user "$1" "$2"