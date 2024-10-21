const core = require('@actions/core');



console.log(process.env);




const CONTEXT_GITHUB = JSON.parse(process.env.CONTEXT_GITHUB);

// Determine action
// GITHUB_EVENT_NAME
// const action = CONTEXT_GITHUB.action;
// console.log(action);

// Opening a PR.
if (process.env.GITHUB_EVENT_NAME == "pull_request" && process.env.GITHUB_EVENT_ACTION == "opened") {
  console.log(CONTEXT_GITHUB);
  let current_description = CONTEXT_GITHUB.event.pull_request.body ?? "";
  console.log(current_description);

  if (current_description) {
    // MSG_SEPERATOR.
    console.log(process.env.MSG_SEPERATOR);
    console.log(current_description.split(process.env.MSG_SEPERATOR));
  }
}


else {
  console.log("Sorry, I don't know what to do.");
}



try {
  const myOutput = 'Hello from JavaScript!';
  core.setOutput('myOutput', myOutput);
} catch (error) {
  core.setFailed(error.message);
}
