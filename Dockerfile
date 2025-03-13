# syntax=docker/dockerfile:1

FROM golang:1.23

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY container_src/go.mod ./
RUN go mod download

COPY container_src/*.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /server

EXPOSE 8080

# Run
CMD ["/server"]
