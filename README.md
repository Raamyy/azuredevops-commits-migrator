# Azure DevOps to GitHub Migration Tool

Github profile is so boring when no activity is there when you work at a company that use Azure Devops.

This project helps users automate the migration of commits and Pull Requests (PRs) from an Azure DevOps repository to a GitHub repository. It uses a GitHub workflow to automate the migration process.


# Getting Started
1. Fork this repository\
  Click the Fork button in the top-right corner of this page to fork the master repository.

2. Go to forked repo in your repository

3. Add secrets:\
  settings -> Actions secrets and variables -> Repository secrets -> New repository secrets
  ![alt text](resources/image.png)

    ```bash
    PAT  # Your Azure PAT, you'll know how to get it below

    USER_EMAIL  # Your GITHUB user email

    USER_NAME # Your GITHUB user name

    AZURE_NAME  # YOUR username on Azure

    # Set this number to 1, unless you want to fetch all the previous history
    DAYS_LOOKUP

    # This is Github PAT, you'll know how to set below
    GH_WRITE_TOKEN

    # Your Azure DevOps Organization name (e.g. `dev.azure.com/abcd` abcd is the value)
    ORG
    
    # Your destination Github Repository e.g. `Iwan-LMX/azuredevops-commits-migrator` is the value, see below for setting it
    TRACKER_REPO
    ```
6. Run the workflow\
	Actions -> Sync commits with azure devops -> run workflow
	![alt text](resources/image2.png)

## Set Github PAT
Click your avatar in github, find settings -> Develop settings -> Personal access tokens (classic) / Fine-grained personal access tokens -> make sure the your target github repo is covered in the `Repository access`. [Add token](https://github.com/settings/personal-access-tokens).

## Set Azure PAT
user settings (in your project right top) -> Personal access tokens -> New token (Simply give all access)

## For the TRACKER_REPO
For this repo you can choose private or public as you want. But this default branch name should be `master`

<!-- Written by [Iwan Li](https://github.com/Iwan-LMX) -->