#!/usr/bin/env groovy

pipeline {

  agent any

  stages {
    stage('init') {
      steps {
        script {
          def scmVars = checkout scm
          env.GIT_PREVIOUS_SUCCESSFUL_COMMIT = scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT
          env.GIT_LOCAL_BRANCH = scmVars.GIT_LOCAL_BRANCH
        }
      }
    }
    stage('web-client') {
      when {
        expression {
          return checkCommit()
        }
      }
      steps {
        build 'web-client'
      }
    }
    stage('serverless-api') {
      when {
        expression {
          return checkCommit()
        }
      }
      steps {
        build 'serverless-api'
      }
    }
  }
}

def checkCommit() {
  def branch = env.BRANCH_NAME
  def branchToCheck = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
  if (branch == 'develop' || branch == 'master') {
    echo "using diff against commit: $GIT_PREVIOUS_SUCCESSFUL_COMMIT"
    branchToCheck = $GIT_PREVIOUS_SUCCESSFUL_COMMIT
  } else {
    echo "using diff againt branch: $GIT_LOCAL_BRANCH"
    branchToCheck = $GIT_LOCAL_BRANCH
  }
  def matches = sh(returnStatus:true, script: "git diff --name-only $branchToCheck | egrep -q '^web-client'")
  return !matches
}