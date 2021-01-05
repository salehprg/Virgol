# bash update.sh  1.3.6

# sudo chown -R tiger:tiger lms-with-moodle

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

sudo git stash
sudo git pull origin Beta
# sudo git pull origin master

# docker image prune 
sudo docker login
sudo docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG -t $IMAGE_ACCOUNT/$IMAGE_REPO:latest .
cp src/Presentation/Virgol.School/ClientApp/public/manifest-dei.json src/Presentation/Virgol.School/ClientApp/public/manifest.json 
sudo docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG-dei .
sudo docker push $IMAGE_ACCOUNT/$IMAGE_REPO
# docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG 
# docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG:latest
docker-compose up -d
