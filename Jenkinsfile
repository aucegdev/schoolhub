pipeline {
  agent any
  
  environment {
    DOCKER_REGISTRY = 'schoolhubdev'
    APP_NAME = 'schoolhub'
  }
  
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    
    stage('Install Dependencies') {
      parallel {
        stage('Backend') {
          steps {
            dir('backend') {
              sh 'npm ci'
            }
          }
        }
        stage('Frontend') {
          steps {
            dir('frontend') {
              sh 'npm ci'
            }
          }
        }
      }
    }
    
    stage('Lint') {
      parallel {
        stage('Backend Lint') {
          steps {
            dir('backend') {
              sh 'npm run lint'
            }
          }
        }
        stage('Frontend Lint') {
          steps {
            dir('frontend') {
              sh 'npm run lint'
            }
          }
        }
      }
    }
    
    stage('Build') {
      parallel {
        stage('Build Backend') {
          steps {
            dir('backend') {
              sh 'npx prisma generate && npm run build'
            }
          }
        }
        stage('Build Frontend') {
          steps {
            dir('frontend') {
              sh 'npm run build'
            }
          }
        }
      }
    }
    
    stage('Docker Build') {
      parallel {
        stage('Build Backend Image') {
          steps {
            dir('backend') {
              sh "docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-backend:${BUILD_NUMBER} ."
            }
          }
        }
        stage('Build Frontend Image') {
          steps {
            dir('frontend') {
              sh "docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-frontend:${BUILD_NUMBER} ."
            }
          }
        }
      }
    }
    
    stage('Docker Push') {
      when {
        branch 'main'
      }
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker-registry-credentials', url: '') {
            sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}-backend:${BUILD_NUMBER}"
            sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}-frontend:${BUILD_NUMBER}"
          }
        }
      }
    }
  }
  
  post {
    always {
      cleanWs()
    }
    success {
      echo 'Pipeline succeeded'
    }
    failure {
      echo 'Pipeline failed'
    }
  }
}
