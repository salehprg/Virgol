sudo git pull
# git config --global user.name 'your user name'
# git config --global user.password 'your password'
docker build -t goldenstarc/lms:0.3 .
docker stop lms_0.3
docker rm lms_0.3
docker run \
    -p 5001:80 \
    --restart=always \
    --name=lms_0.3 \
    -d goldenstarc/lms:0.3
# docker push goldenstarc/lms:0.3
