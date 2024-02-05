FROM golang:1.20-bullseye as base

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/notediary-backend" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid 65532 \
    notediary-backend

WORKDIR $GOPATH/src/notediary-backend/app/

COPY go.mod go.sum ./

RUN go mod download
RUN go mod verify

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/app.exe .

EXPOSE 8081

FROM scratch

COPY --from=base /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=base /etc/passwd /etc/passwd
COPY --from=base /etc/group /etc/group

COPY config.yaml .
COPY /public public/
COPY --from=base bin/app.exe app.exe

USER notediary-backend:notediary-backend

CMD ["./app.exe"]