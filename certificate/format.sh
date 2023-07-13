#!/bin/bash

awk '{gsub(/\\n/,"\n")}1' cert.txt | tee cert.pem
awk '{gsub(/\\n/,"\n")}1' key.txt | tee key.pem
cat key.pem cert.pem > client_certificate.pem