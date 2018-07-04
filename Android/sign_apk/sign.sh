#!/bin/bash
echo 111111 | jarsigner -verbose -keystore keyfile -signedjar $1_signed.apk $1 apk
