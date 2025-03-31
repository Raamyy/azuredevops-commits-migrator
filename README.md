Azure DevOps to GitHub Migration Tool


This project helps users migrate commits and Pull Requests (PRs) from an Azure DevOps repository to a GitHub repository. It uses a GitHub workflow to automate the migration process.


# Overview


This project consists of two repositories:

Main Repository: Contains the migration code.

Dummy Repository: A private repository to store contributions as lines in the README.md file, simulating PR and commit additions.

A GitHub workflow automates the migration process, transferring commits and PRs from Azure DevOps to GitHub.


# How It Works


The user forks this repository.

The user updates specific variables in the GitHub workflow to include their Azure DevOps organization details and a personal GitHub token.

The workflow fetches the commits and PRs from Azure DevOps and pushes them to the dummy repository, adding them as contributions.


# Prerequisites

Before you begin, ensure you have:

- A GitHub account.

- A private dummy GitHub repository.

- Access to an Azure DevOps organization with repositories.

- A GitHub Personal Access Token (PAT) with repo and workflow permissions.


# Getting Started


1. Fork this repository\
  Click the Fork button in the top-right corner of this page to fork the main repository.

2. Set Up Your Dummy Repository\
Create a new private repository on your GitHub account. This will be used to store the migration contributions in a README.md file.

3. Generate a GitHub Token\
You will need a GitHub Personal Access Token (PAT) with the following permissions:
  repo (Full control of private repositories)
  workflow (Read and write workflows)

## To generate a token:

Go to Settings > Developer settings > Personal access tokens.
Click Generate new token.
Select the necessary scopes and copy the token.


# Configuration

1. Edit the GitHub Workflow

In your forked repository, open the .github/workflows/migrate.yml file. You will need to update the following fields:

    Azure DevOps organization name: Your Azure DevOps organization.
    Dummy repository name: The private repository you created earlier.
    GitHub username and email: Your GitHub account details.


```yaml
env:
  AZURE_ORG: "your-azure-devops-organization"    # Your Azure DevOps organization
  TRACKER_REPO: "your-private-dummy-repo"          # Name of your dummy repository
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}        # GitHub token to authenticate and push to the dummy repo
```
2. Add the GitHub Token
Add your GitHub token as a repository secret in your fork:

Go to the Settings tab of your forked repository.

Select Secrets and variables > Actions.

Click New repository secret.

Name it GITHUB_TOKEN and paste your token in the value field.


Running the Workflow


Once the configuration is complete, the GitHub workflow will run automatically once per day.

The workflow will fetch commits and PRs from your Azure DevOps organization and push contributions to the dummy repository in the form of lines added to the README.md file.


# Contributing


Contributions are welcome! Please open an issue or submit a pull request if you would like to improve the tool.
