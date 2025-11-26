# Run Jenkins with docker

```bash
docker pull jenkins/jenkins:latest
```

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:latest
```

## Get password

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword

```
