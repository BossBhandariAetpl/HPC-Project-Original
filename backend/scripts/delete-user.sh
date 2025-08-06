#!/bin/bash

# Function to delete user from both system and LDAP
delete_system_and_ldap_user() {
    local username=$1

    # Check if username is provided
    if [ -z "$username" ]; then
        echo "Username is required."
        exit 1
    fi

     # Delete user from system
    userdel -r "$username"
    if [ $? -ne 0 ]; then
        echo "Failed to delete system user $username."
        exit 1
    fi

    # Define LDAP details
    LDAP_BASE_DN="dc=aura,dc=hpc,dc=org"
    LDAP_USER_DN="uid=$username,ou=users,$LDAP_BASE_DN"
    LDAP_GROUP_DN="cn=$username,ou=groups,$LDAP_BASE_DN"
    LDAP_ADMIN_DN="cn=Manager,$LDAP_BASE_DN"
    LDAP_ADMIN_PASSWORD="secret"

#     # Prepare LDIF file for deleting user
#     cat <<EOF > /tmp/$username-delete.ldif
# dn: $LDAP_USER_DN
# changetype: delete

# dn: $LDAP_GROUP_DN
# changetype: delete
# EOF

    # Debug information: print LDIF file content
    echo "LDIF file content:"
    cat /tmp/$username-delete.ldif

    # Delete user from LDAP
    # ldapdelete -D "$LDAP_ADMIN_DN" -w "$LDAP_ADMIN_PASSWORD" -f /tmp/$username-delete.ldif
    ldapdelete -v -c -D $LDAP_ADMIN_DN -w secret $LDAP_USER_DN
    ldapdelete -v -c -D $LDAP_ADMIN_DN -w secret $LDAP_GROUP_DN
    
    if [ $? -eq 0 ]; then
        echo "System and LDAP user $username deleted successfully."
    else
        echo "Failed to delete LDAP user $username."
        exit 1
    fi

    # Clean up temporary file
    # rm -f /tmp/$username-delete.ldif                            
}

# Main script execution
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root." 1>&2
    exit 1
fi

# Check if username is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <username>" 1>&2
    exit 1
fi

delete_system_and_ldap_user "$1"