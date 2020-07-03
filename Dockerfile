# https://hub.docker.com/_/microsoft-dotnet-core
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
# COPY SMSPanel/*.csproj ./aspnetapp/
# RUN dotnet restore

RUN apt update -yq \
    && apt install curl gnupg libgdiplus libc6-dev -yq \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt install nodejs -yq


# copy everything else and build app
COPY src/. ./aspnetapp/
WORKDIR /source/aspnetapp
RUN dotnet publish -c release -o /app --self-contained false
RUN ls
# --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
RUN apt update -yq \
    && apt install nano -yq
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["./Virgol.School"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]