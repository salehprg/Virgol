# https://hub.docker.com/_/microsoft-dotnet-core
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build

WORKDIR /src                                                                    
COPY ./src ./

RUN apt update -yq \
    && apt install curl gnupg libgdiplus libc6-dev -yq \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt install nodejs -yq

# restore solution
RUN dotnet restore Virgol.sln


WORKDIR /src/Presentation/Virgol.School 

# build project   
RUN dotnet build Virgol.School.csproj -c Release


# # build plugins
# WORKDIR /src/Plugins/Nop.Plugin.DiscountRules.CustomerRoles
# RUN dotnet build Nop.Plugin.DiscountRules.CustomerRoles.csproj -c Release

# publish project
# WORKDIR /src/Presentation/Virgol.School 
RUN dotnet publish Virgol.School.csproj -c Release -o /app/published --self-contained false

# final stage/image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

RUN apt update -yq \
    && apt install nano -yq
WORKDIR /app

COPY --from=build /app/published ./
ENTRYPOINT ["./Virgol.School"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]