#!/bin/sh
set -e

# รอ database พร้อม
wait-for-it postgres:5432 -t 30

# migrate ก่อน start server
bunx prisma migrate deploy

# start app
bun server.js
