fandogh namespace active --name goldenstarc
fandogh service apply \
-f ../fandogh-manifests/service-manifest.yaml \
-p IMAGE_URL \
-p TAG \
-p SEC_NAME
