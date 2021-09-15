import * as core from '@actions/core';
import * as github from '@actions/github';

if (!github) {
    throw new Error('Module not found: github');
}

if (!core) {
    throw new Error('Module not found: core');
}

async function main() {
    console.log("hello TypeScript")
    const {repo: {owner, repo}} = github.context;
//     if (!github.context.payload.pull_request) {
//         console.error("Action available only at pull_request")
//         return
//     }
//     const branch = github.context.payload.pull_request.head.ref;
    console.log(`github.context: `, github.context)
    console.log(`github.context.workflow: `, github.context.workflow)
    console.log(`github.context.payload: `, github.context.payload)
    const branch = github.context.ref;
    // console.log({eventName, sha, headSha, branch, owner, repo});
    const token = core.getInput('access_token', {required: true});
    console.log(`Found token: ${token ? 'yes' : 'no'}`);
    const octokit = new github.GitHub(token);

    const allWorkflows = await octokit.actions.listRepoWorkflows({
        owner: owner,
        repo: repo
    })
    const workflow = allWorkflows.data.workflows.find(wf => wf.name === github.context.workflow)
    if (workflow === undefined) {
        console.error(`can't find workflow ${github.context.workflow}`)
        return
    }
    console.log("branch", branch)
    console.log("workflow: ", workflow)
    const runs = (await octokit.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id: workflow.id,
        branch: "master"//branch
    })).data;

//     const pull_request = github.context.payload.pull_request
//     const maxRunNumber = Math.max.apply(Math, runs.workflow_runs.map(run => run.run_number))

    //todo log:
    //console.log("run.run_number: ", run.run_number)
    //console.log("workflow.id: ", workflow.id)
    console.log(`runs.workflow_runs.length: ${runs.workflow_runs.length}`)
    const anotherWorkflows = runs.workflow_runs.filter(
        run =>
            run.status !== 'completed' &&  // проверка не завершилась
            run.head_sha !== github.context.payload.after
    );
    const currentWorkflow = runs.workflow_runs.filter(
        run =>
            run.head_sha === github.context.payload.after
    )[0];
    console.log("currentWorkflow", currentWorkflow)
    console.log(`Found ${anotherWorkflows.length} runs in progress.`);
    console.log("anotherWorkflows", anotherWorkflows)
    if (anotherWorkflows.length > 0) {
        console.log("cancel current run, workflow.id: ", workflow.id)
        const res = await octokit.actions.cancelWorkflowRun({
                        owner,
                        repo,
                        run_id: currentWorkflow.id
                    });
                    console.log(`Status ${res.status}`);
    }
//     for (const {id, head_sha, status} of anotherWorkflows) {
//         try {
//             console.log('Cancelling another run: ', {id, head_sha, status});
//             const res = await octokit.actions.cancelWorkflowRun({
//                 owner,
//                 repo,
//                 run_id: id
//             });
//             console.log(`Status ${res.status}`);
//         } catch (e) {
//             const msg = e.message || e;
//             console.log(`Error while cancelling workflow_id ${workflow.id}: ${msg}`);
//         }
//     }
    console.log('Done.');
}

main()
    .then(() => core.info('Cancel Complete.'))
    .catch(e => core.setFailed(e.message));
