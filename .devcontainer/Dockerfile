# Use Alpine as base
FROM alpine:latest

# Enable bun installation dependencies
RUN apk add --no-cache \
    ca-certificates \
    git \
    wget \
    curl \
    fish \
    unzip \
    && curl -fsSL https://bun.sh/install | bash

# Add bun to PATH
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Install additional utilities
RUN apk add --no-cache \
    eza \
    bat \
    && wget -O /usr/local/bin/bat \
        https://github.com/sharkdp/bat/releases/download/v0.23.0/bat-v0.23.0-x86_64-unknown-linux-musl.tar.gz \
    && chmod +x /usr/local/bin/bat

# Install GitHub CLI via official script
RUN wget -O - https://cli.github.com/packages/archive-keyring.gpg | apk add --no-cache - \
    && echo "https://cli.github.com/packages/alpine stable main" \
        >> /etc/apk/repositories \
    && apk update \
    && apk add --no-cache gh

# Make Fish the default shell
RUN chsh -s /usr/bin/fish

# Create a non-root user
ARG USERNAME=dev
RUN adduser -D $USERNAME && \
    echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER $USERNAME
WORKDIR /workspace

