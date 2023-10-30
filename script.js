const process = require("process");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

const fs = require('fs');
const axios = require('axios').default;
const moment = require('moment');

require('dotenv').config()

const AZURE_PAT = process.env.PAT;
const AUTH_TOKEN = Buffer.from(":" + AZURE_PAT).toString('base64')
const ORG = process.env.ORG;

async function getProjects() {
  const url = `https://dev.azure.com/${ORG}/_apis/projects?api-version=7.1-preview.4`;
  let config = {
    method: 'get',
    headers: {
      'authority': 'dev.azure.com',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en',
      'cache-control': 'no-cache',
      'Authorization': 'Basic ' + AUTH_TOKEN,
      'pragma': 'no-cache',
    }
  };
  let projects = await axios.get(url, config);
  console.log(projects.data);
  console.log(`got ${projects.data.count} projects`);
  return projects.data.value.map(p => p.name);
}

async function getRepositories(project) {
  const url = `https://dev.azure.com/${ORG}/${project}/_apis/git/repositories?api-version=4.1`;
  let config = {
    method: 'get',
    headers: {
      'authority': 'dev.azure.com',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en',
      'cache-control': 'no-cache',
      'Authorization': 'Basic ' + AUTH_TOKEN,
      'pragma': 'no-cache',
    }
  };
  let repos = await axios.get(url, config);
  console.log(`got ${repos.data.count} repos in ${project} project`);
  // console.log(repos.data.value);
  return repos.data.value.filter(r => r.isDisabled == false && r.defaultBranch).map((p) => {
    return {
      name: p.name,
      defaultBranch: p.defaultBranch.split('/')[2]
    }
  });
}

async function getCommits(project, repo, author, branch) {
  let currentPage = 0;
  let pageSize = 100;
  let allCommits = [];
  let count = 0;
  let fromDate = moment().subtract(process.env.DAYS_LOOKUP ?? 1, 'days').format('MM/DD/yyyy').toString();

  do {
    console.log(`getting page ${currentPage} commits in ${project} project ${repo} repo`);
    const url = `https://dev.azure.com/${ORG}/${project}/_apis/git/repositories/${repo}/commits?searchCriteria.author=${author}&api-version=7.1-preview.1&searchCriteria.itemVersion.version=${branch}&searchCriteria.itemVersion.versionType=branch&searchCriteria.fromDate=${fromDate}&$top=${pageSize}&$skip=${currentPage * pageSize}`;
    let config = {
      method: 'get',
      headers: {
        'authority': 'dev.azure.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'cache-control': 'no-cache',
        'Authorization': 'Basic ' + AUTH_TOKEN,
        'pragma': 'no-cache',
      }
    };
    let commits = await axios.get(url, config);
    count = commits.data.count;
    commits = commits.data.value.map(function (commit) {
      return {
        creationDate: new Date(commit.author?.date),
        comment: `[${repo}] ${commit.comment}`,
        remoteUrl: commit.remoteUrl.replace(/ /g, "%20")
      }
    });
    allCommits = allCommits.concat(commits);
    currentPage++;
  } while (count == pageSize)

  console.log(`got ${allCommits.length} commits in ${project} project ${repo} repo`);
  return allCommits;
}


async function generateGitCommits(commits) {
  if (!commits.length) return;
  let i = 1;
  for (const commit of commits) {
    let formattedDate = moment(commit.creationDate).format('YYYY-MM-DD HH:MM:SS');
    const text = `### _${formattedDate}_ **${commit.comment}** ([link](${commit.remoteUrl}))\n\n`
    fs.appendFileSync('README.md', text, { flag: 'a+' });
    await execAsync(`git add README.md`);
    await execAsync(`set GIT_COMMITTER_DATE='${formattedDate}'`);
    await execAsync(`set GIT_AUTHOR_DATE='${formattedDate}'`);
    await execAsync(`git commit -m "${commit.comment}" --date "${formattedDate}"`);
    console.log(`${i}/${commits.length}`);
    i++;
  }
  console.log(`committed all ${commits.length} commits`);
  await execAsync(`git push origin master`);

}

async function main() {
  let COMMITS = [];
  let projects = await getProjects();
  for (let project of projects) {
    let repositories = await getRepositories(project);
    for (let repo of repositories) {
      let commits = await getCommits(project, repo.name, "Raamyy", repo.defaultBranch);
      COMMITS = COMMITS.concat(commits);
    }
  }
  COMMITS = COMMITS.sort(function (a, b) {
    return new Date(a.creationDate) - new Date(b.creationDate);
  });
  console.log(`got toal of ${COMMITS.length} pr`);
  generateGitCommits(COMMITS)
}

main()