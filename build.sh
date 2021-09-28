# build options
# BUILD_REVISION=`git rev-parse --short HEAD`
# BUILD_DIR_BASE=`git rev-parse --git-dir`/..
# BUILD_VERSION?=
# BUILD_IMAGE=0
IMAGE_ACCOUNT=${2:-goldenstarc}
IMAGE_REPO=${3:-virgol}
IMAGE_TAG=${1:-latest}
TAG_REVISION=0

sudo git stash
sudo git pull origin master

sudo docker login
sudo sed -i 's/process.env.REACT_APP_VERSION/'$IMAGE_TAG' نسخه/g' ./src/Presentation/Virgol.School/ClientApp/src/components/login/Login.js
sudo docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG -t $IMAGE_ACCOUNT/$IMAGE_REPO:latest --force-rm .
sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO
sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG

# DEI
#cp src/Presentation/Virgol.School/ClientApp/public/index-dei.html src/Presentation/Virgol.School/ClientApp/public/index.html
#cp src/Presentation/Virgol.School/ClientApp/public/manifest-dei.json src/Presentation/Virgol.School/ClientApp/public/manifest.json 
#sudo docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG-dei -t $IMAGE_ACCOUNT/$IMAGE_REPO:latest-dei --force-rm .
#sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO:latest-dei
#sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG-dei

echo -e "\ncd ~/docker/virgol/ && docker-compose pull && docker-compose up -d\n"
