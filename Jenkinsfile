pipeline {
    agent {label 'devops-qa'}
    environment {
        DOCKER_REPO = "tiendaaliadosback.claro.com.co"
    }
    stages {

        stage('Clone repository') {
            steps {
                git branch: 'dev', credentialsId: 'bitbucket-credentials', url: 'https://EmmanuelVegaLira@bitbucket.org/emmanuelvegalira/api-ecommerce.git'
            }
        }

        stage('Build docker image') {
            environment {
                VERSION = """${sh(returnStdout: true, script: 'jq -r .version ./package.json | xargs').trim()}"""
                NAME = """${sh(returnStdout: true, script: 'jq -r .name ./package.json | xargs').trim()}"""
            }
            steps {
                sh 'docker build . -t $NAME:$VERSION'
            }
        }

        stage('Create tag for a new docker image') {
            environment {
                VERSION = """${sh(returnStdout: true, script: 'jq -r .version ./package.json | xargs').trim()}"""
                NAME = """${sh(returnStdout: true, script: 'jq -r .name ./package.json | xargs').trim()}"""     
            }
            steps {
                sh 'docker tag $NAME:$VERSION $DOCKER_REPO/$NAME:$VERSION'
            }
        }

        stage('Push new image to Dockerhub') {
            environment {
                VERSION = """${sh(returnStdout: true, script: 'jq -r .version ./package.json | xargs').trim()}"""
                NAME = """${sh(returnStdout: true, script: 'jq -r .name ./package.json | xargs').trim()}"""
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'claroco-nexus', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                    sh 'docker login -u $USERNAME -p $PASSWORD $DOCKER_REPO'
                    sh 'docker push $DOCKER_REPO/$NAME:$VERSION'
                }
            }
        }

        stage('Deploy into kubernetes cluster') {
            environment {
                VERSION = """${sh(returnStdout: true, script: 'jq -r .version ./package.json | xargs').trim()}"""
                NAME = """${sh(returnStdout: true, script: 'jq -r .name ./package.json | xargs').trim()}"""
            }

            steps {
               withKubeConfig([credentialsId: 'kubernetes-credentials', serverUrl: 'https://100.126.20.95:6443']) {
                   sh "sed -i 's|NAME|${NAME}|' ${WORKSPACE}/k8s/deployment.yaml"
                   sh "sed -i 's|IMAGE|${DOCKER_REPO}/${NAME}:${VERSION}|' ${WORKSPACE}/k8s/deployment.yaml"
                    sh 'kubectl apply -f ${WORKSPACE}/k8s/deployment.yaml'
                }
            }
        }

    }
}