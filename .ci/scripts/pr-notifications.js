


console.log(process.env);

const CONTEXT_GITHUB = JSON.parse(process.env.CONTEXT_GITHUB);

// Determine action
// GITHUB_EVENT_NAME
// const action = CONTEXT_GITHUB.action;
// console.log(action);

// Opening a PR.
if (process.env.GITHUB_EVENT_NAME == "pull_request" && process.env.GITHUB_EVENT_TYPE == "opened") {
  let current_description = CONTEXT_GITHUB.body ?? "";
  console.log(current_description);
}


else {
  console.log("Sorry, I don't know what to do.");
}
