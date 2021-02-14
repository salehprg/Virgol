# build options
# BUILD_REVISION=`git rev-parse --short HEAD`
# BUILD_DIR_BASE=`git rev-parse --git-dir`/..
# BUILD_VERSION?=
# BUILD_IMAGE=0
IMAGE_ACCOUNT=${2:-goldenstarc}
IMAGE_REPO=${3:-virgol}
IMAGE_TAG=${1:-latest}
TAG_REVISION=0

# For first time
# sudo git branch --track Beta origin/Beta
# sudo git checkout Beta

#sudo git stash
#sudo git pull origin master
# sudo git pull origin Beta

# docker image prune
sudo sed -i 's/process.env.REACT_APP_VERSION/'$IMAGE_TAG' نسخه/g' ./src/Presentation/Virgol.School/ClientApp/src/components/login/Login.js
sudo docker login
sudo docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG -t $IMAGE_ACCOUNT/$IMAGE_REPO:latest --force-rm .
cp src/Presentation/Virgol.School/ClientApp/public/index-dei.html src/Presentation/Virgol.School/ClientApp/public/index.html
cp src/Presentation/Virgol.School/ClientApp/public/manifest-dei.json src/Presentation/Virgol.School/ClientApp/public/manifest.json 
sudo docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG-dei -t $IMAGE_ACCOUNT/$IMAGE_REPO:latest-dei --force-rm .

sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO
sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO:latest-dei
sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG
sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG-dei

echo -e "\ncd ~/docker/virgol/ && docker-compose pull && docker-compose up -d\n"
# docker-compose up -d

# docker exec -it virgol_dei grep -rl "dei.razaviedu.ir" .
# docker exec -it virgol_dei  sed -i 's/panel.vir-gol.ir/dei.razaviedu.ir/g' ./ClientApp/build/static/js/main.7f756e2c.chunk.js.map
# docker exec -it virgol_dei  sed -i 's/panel.vir-gol.ir/dei.razaviedu.ir/g' ./ClientApp/build/static/js/main.7f756e2c.chunk.js
