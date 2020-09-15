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

sudo git stash
sudo git pull origin Beta
# sudo git branch --track Beta origin/Beta
# sudo git checkout Beta

docker login
docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG .
docker tag  $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG  $IMAGE_ACCOUNT/$IMAGE_REPO:latest
docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG 
docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG:latest
# docker push $IMAGE_ACCOUNT/$IMAGE_REPO
