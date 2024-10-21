


console.log(process.env);

const CONTEXT_GITHUB = JSON.parse(process.env.CONTEXT_GITHUB);

// Determine action
// GITHUB_EVENT_NAME
// const action = CONTEXT_GITHUB.action;
// console.log(action);

// Opening a PR.
if (process.env.GITHUB_EVENT_NAME == "pull_request" && process.env.GITHUB_EVENT_ACTION == "opened") {
  console.log(CONTEXT_GITHUB);
  let current_description = CONTEXT_GITHUB.pull_request.body ?? "";
  console.log(current_description);
}


else {
  console.log("Sorry, I don't know what to do.");
}
