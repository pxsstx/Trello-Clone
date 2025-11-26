pipeline {
    agent any

    triggers {
        // Poll SCM ทุก 2 นาที เป็นตัวกันพลาดถ้า webhook ใช้ไม่ได้
        pollSCM('H/2 * * * *')
    }

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    parameters {
        booleanParam(
            name: 'CLEAN_VOLUMES',
            defaultValue: false,
            description: 'ลบ volume ทั้งหมด (ล้าง database)'
        )
    }

    stages {

        /* -------------------------------------------------------------------
         * 1) CHECKOUT CODE
         * -------------------------------------------------------------------*/
        stage('Checkout') {
            steps {
                script {
                    echo "➡️ Checking out code..."
                    checkout scm

                    env.GIT_COMMIT_SHORT = sh(
                        returnStdout: true,
                        script: 'git rev-parse --short HEAD'
                    ).trim()

                    echo "Build: ${BUILD_TAG}, Commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        /* -------------------------------------------------------------------
         * 2) VALIDATE DOCKER COMPOSE
         * -------------------------------------------------------------------*/
        stage('Validate Compose') {
            steps {
                sh 'docker compose config'
                echo "Compose file OK"
            }
        }

        /* -------------------------------------------------------------------
         * 3) INSTALL BUN
         * -------------------------------------------------------------------*/
        stage('Install Bun') {
            steps {
                sh 'curl -fsSL https://bun.sh/install | bash'
                sh 'export PATH="$HOME/.bun/bin:$PATH"'
            }
        }

        /* -------------------------------------------------------------------
         * 4) INSTALL DEPENDENCIES
         * -------------------------------------------------------------------*/
        stage('Install Dependencies') {
            steps {
                sh '~/.bun/bin/bun install'
            }
        }

        /* -------------------------------------------------------------------
         * 5) PRISMA MIGRATE DEPLOY
         * -------------------------------------------------------------------*/
        stage('Prisma Migrate') {
            steps {
                sh '''
                export PATH="$HOME/.bun/bin:$PATH"
                ~/.bun/bin/bunx prisma migrate deploy
                '''
            }
        }

        /* -------------------------------------------------------------------
         * 6) BUILD NEXT.JS
         * -------------------------------------------------------------------*/
        stage('Build Next.js') {
            steps {
                sh '~/.bun/bin/bun run build'
            }
        }

        /* -------------------------------------------------------------------
         * 7) DEPLOY WITH DOCKER COMPOSE
         * -------------------------------------------------------------------*/
        stage('Deploy') {
            steps {
                script {
                    echo "➡️ Deploying to production..."

                    def downCommand = 'docker compose down'
                    if (params.CLEAN_VOLUMES) {
                        echo "⚠️ CLEAN_VOLUMES=true → removing all volumes"
                        downCommand = 'docker compose down -v'
                    }

                    sh downCommand
                    sh '''
                        docker compose build --no-cache
                        docker compose up -d
                    '''
                }
            }
        }

        /* -------------------------------------------------------------------
         * 8) HEALTH CHECK
         * -------------------------------------------------------------------*/
        stage('Health Check') {
            steps {
                script {
                    echo "⏳ Waiting for services..."
                    sh 'sleep 15'

                    echo "➡️ Checking API health..."

                    sh '''
                        timeout 60 bash -c 'until curl -f http://localhost:3000; do sleep 2; done' || exit 1
                        echo "Health OK!"
                    '''
                }
            }
        }

        /* -------------------------------------------------------------------
         * 9) VERIFY DEPLOY
         * -------------------------------------------------------------------*/
        stage('Verify Deployment') {
            steps {
                script {
                    sh """
                    echo "=== Containers ==="
                    docker compose ps

                    echo "=== Logs (last 20 lines) ==="
                    docker compose logs --tail=20
                    """
                }
            }
        }
    }

    /* -------------------------------------------------------------------
     * POST ACTIONS
     * -------------------------------------------------------------------*/
    post {
        success {
            echo "✅ Deploy success!"
            echo "Frontend: http://localhost:3000"
        }

        failure {
            echo "❌ Deploy failed!"
            sh 'docker compose logs --tail=50 || true'
        }

        always {
            echo "🧹 Cleaning Docker garbage"
            sh '''
                docker image prune -f
                docker container prune -f
            '''
        }
    }
}