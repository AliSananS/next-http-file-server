# Use Alpine as base
FROM node:lts-alpine

# Enable bun installation dependencies
RUN apk add --no-cache \
    ca-certificates \
    git \
    wget \
    curl \
    fish \
    unzip \
    bash \
    sudo \
    github-cli

CMD ["/usr/bin/fish"]


# Create a non-root user
ARG USERNAME=dev
RUN adduser -D $USERNAME && \
    echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER $USERNAME
WORKDIR /workspace/next-http-file-server

RUN curl -fsSL https://bun.com/install | bash

ENV PATH="${PATH}:/home/dev/.bun/bin"