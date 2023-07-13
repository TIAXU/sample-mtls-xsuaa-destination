# Deploy
https://blogs.sap.com/2022/07/28/sap-btp-security-how-to-use-mtls-with-destinations/

**Frontend** app (bind with destination) ---call---> **Backend** app (bind with xsuaa)

- Manually get the cert and key from the xsuaa instance

- Merge key.pem and cert.pem
  ```
  cd certificate
  ./format.sh
  ```

- Upload Certificate

- Create Destination Configuration



# Limitation
cn40 is not supported. 

Instead, get token and call it manually without destination.