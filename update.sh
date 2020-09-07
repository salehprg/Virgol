# sudo chown -R tiger:tiger lms-with-moodle
git pull
# git config --global user.name 'Hamid Najafi'
# git config --global user.password 'Password'
docker build -t goldenstarc/virgol:1.2.0 .
docker stop virgol_1.2.0
docker rm virgol_1.2.0
docker run \
    -p 5001:80 \
    -v VirgolExcels:/app/BulkData \
    --restart=always \
    --name=virgol_1.2.0 \
    -d goldenstarc/virgol:1.2.0
# docker login
# docker push goldenstarc/virgol:1.2.0
