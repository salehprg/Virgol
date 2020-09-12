# bash update.sh  1.3.6

# sudo chown -R tiger:tiger lms-with-moodle

# build options
# BUILD_REVISION=`git rev-parse --short HEAD`
# BUILD_DIR_BASE=`git rev-parse --git-dir`/..
# BUILD_VERSION?=
# BUILD_IMAGE=0
IMAGE_TAG=${1:-latest}
GIT_BRANCH=${2:-Beta}
IMAGE_ACCOUNT=${3:-goldenstarc}
IMAGE_REPO=${4:-virgol}
TAG_REVISION=0

sudo git stash
sudo git pull origin $GIT_BRANCH
sudo git checkout origin/$GIT_BRANCH
#sudo git checkout origin/master

docker login
docker build -t $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG .
docker tag  $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG  $IMAGE_ACCOUNT/$IMAGE_REPO:latest
docker push $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG
docker stop $IMAGE_REPO
docker rm $IMAGE_REPO
docker run \
    -p 8086:80 \
    -v VirgolExcels:/app/BulkData \
    --restart=on-failure \
    --name=$IMAGE_REPO \
    -e "ASPNETCORE_URLS=http://+" \
    -e "ASPNETCORE_ENVIRONMENT=Production" \
    -e "VIRGOL_SERVER_ROOT_URL=http://lms.legace.ir" \
    -e "VIRGOL_DATABASE_TYPE=postgres" \
    -e "VIRGOL_DATABASE_HOST=db.legace.ir" \
    -e "VIRGOL_DATABASE_NAME=LMS" \
    -e "VIRGOL_DATABASE_USER=postgres" \
    -e "VIRGOL_DATABASE_PASSWORD=PostgreSQLpass.24" \
    -e "VIRGOL_MODDLE_COURSE_URL=https://moodle/course/view.php?id=" \
    -e "VIRGOL_MOODLE_BASE_URL=https://moodle/webservice/rest/server.php?moodlewsrestformat=json" \
    -e "VIRGOL_MOODLE_TOKEN=616ed6bc394212692b03ea59b7f94670" \
    -e "VIRGOL_FARAZAPI_URL=http://rest.ippanel.com" \
    -e "VIRGOL_FARAZAPI_SENDER_NUMBER=+98500010707" \
    -e "VIRGOL_FARAZAPI_USERNAME=goldenstarc" \
    -e "VIRGOL_FARAZAPI_PASSWORD=hektug-fakbAm-0vypje" \
    -e "VIRGOL_FARAZAPI_API_KEY=qcP4IQp3PPRV3ppvkG9ScHJcwvUPL3iOJrV9n7QiqDA=" \
    -e "VIRGOL_BBB_BASE_URL=https://b1.legace.ir/bigbluebutton/api/" \
    -e "VIRGOL_BBB_SECRET=1b6s1esKbXNM82ussxx8OHJTenNvfkBu59tkHHADvqk" \
    -e "VIRGOL_BBB_CALLBACK_URL=/meetingResponse/" \
    -e "VIRGOL_JWT_SECRET=Saleh Secret Key" \
    -e "VIRGOL_LDAP_SERVER=ldap.legace.ir" \
    -e "VIRGOL_LDAP_PORT=389" \
    -e "VIRGOL_LDAP_USER_ADMIN=cn=admin,dc=legace,dc=ir" \
    -e "VIRGOL_LDAP_PASSWORD=OpenLDAPpass.24" \
    -e "REACT_APP_HOMEPAGE_TITLE=Virgooool" \
    -d $IMAGE_ACCOUNT/$IMAGE_REPO:$IMAGE_TAG
