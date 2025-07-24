FROM mcr.microsoft.com/devcontainers/javascript-node:20

RUN apt-get update && \
    apt-get install -y fish git curl

    
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:${PATH}"

ENV NODE_ENV=development

USER dev

WORKDIR /workspace/nhfs

COPY ./package*.json ./bun*.lock ./

RUN bun install

COPY . .
