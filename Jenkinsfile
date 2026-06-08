pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        APP_BASE_URL = 'http://localhost:8080'
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cypress-cache"
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Type check') {
            steps {
                bat 'npm run typecheck'
            }
        }

        stage('Run Cypress tests') {
            steps {
                bat 'npm run cy:run'
            }
        }

        stage('Generate Allure report') {
            steps {
                bat 'npm run allure:generate'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/allure-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports/allure-report',
                reportFiles: 'index.html',
                reportName: 'Allure Report'
            ])
        }
    }
}
