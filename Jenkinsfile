pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
        // Add Homebrew Docker path for Jenkins
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${env.PATH}"
    }

    parameters {
        booleanParam(
            name: 'CLEAN_VOLUMES',
            defaultValue: false,
            description: 'Remove docker volumes (clear DB)'
        )
    }

    stages {

        stage('Checkout') {
            steps {
                script {
                    checkout scm
                    env.GIT_COMMIT_SHORT = sh(
                        returnStdout: true,
                        script: 'git rev-parse --short HEAD'
                    ).trim()
                }
            }
        }

        stage('Load Secrets') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'DATABASE_URL', variable: 'DB_URL'),
                        string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET_VALUE')
                    ]) {
                        writeFile file: '.env', text: """\
DATABASE_URL=${env.DB_URL}
JWT_SECRET=${env.JWT_SECRET_VALUE}
NODE_ENV=production
""".stripIndent()
                        echo "Environment secrets loaded -> .env created"
                    }
                }
            }
        }

        stage('Validate Compose') {
            steps {
                sh 'docker compose config'
            }
        }

        stage('Install Bun') {
            steps {
                sh 'curl -fsSL https://bun.sh/install | bash'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '~/.bun/bin/bun install'
            }
        }

        stage('Prisma Migrate') {
            steps {
                sh '''
                export PATH="$HOME/.bun/bin:$PATH"
                ~/.bun/bin/bunx prisma migrate deploy
                '''
            }
        }

        stage('Build Next.js') {
            steps {
                sh '~/.bun/bin/bun run build'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def downCmd = 'docker compose down'
                    if (params.CLEAN_VOLUMES) { downCmd = 'docker compose down -v' }
                    sh downCmd
                    sh 'docker compose build --no-cache'
                    sh 'docker compose up -d'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh 'sleep 15'
                    sh '''
                        timeout 60 bash -c 'until curl -f http://localhost:3000; do sleep 2; done' || exit 1
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deploy Success!"
        }
        failure {
            sh 'docker compose logs --tail=30 || true'
        }
        always {
            sh 'docker image prune -f'
        }
    }
}