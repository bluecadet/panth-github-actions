// Provide these outputs.
// body_footer
// slack payload

const core = require('@actions/core');
const { DateTime } = require("luxon");



try {
  // console.log(process.env);




  const CONTEXT_GITHUB = JSON.parse(process.env.CONTEXT_GITHUB);

  // Determine action
  // GITHUB_EVENT_NAME
  // const action = CONTEXT_GITHUB.action;
  // console.log(action);

  // Opening a PR.
  // if (process.env.GITHUB_EVENT_NAME == "pull_request" && process.env.GITHUB_EVENT_ACTION == "opened") {
  console.log(CONTEXT_GITHUB);
  console.log(CONTEXT_GITHUB.event.pull_request.requested_reviewers);
  console.log(CONTEXT_GITHUB.event.pull_request.user);

  let current_description = CONTEXT_GITHUB.event.pull_request.body ?? "";
  console.log('current_description--->');
  console.log(current_description);
  let body = "";
  let data = "";
  let msg_id = "";

  if (current_description) {
    // MSG_SEPERATOR.
    console.log("SEP=> " + process.env.MSG_SEPERATOR);
    console.log(current_description.split(process.env.MSG_SEPERATOR));

    let bodyObj = current_description.split(process.env.MSG_SEPERATOR);
    console.log('bodyObj--->');
    console.log(bodyObj);
    console.log('bodyObj 0 --->');
    console.log(bodyObj[0]);
    console.log('bodyObj 1 --->');
    console.log(bodyObj[1]);

    body = bodyObj[0];
    data = bodyObj[1] ?? "";
  }

  if (data) {
    const regex = /^msg_id:(.*)/m;
    console.log(data.match(regex));
    const matches = data.match(regex);
    msg_id = matches[1];
  }

  // Build status msg
  // state: 'open',
  // draft: false,
  // created_at: '2024-10-23T00:34:50Z',
  // mergeable: true,
  // mergeable_state: true,
  // comments: 1,
  // commits: 57,
  // review_comments: 0,
  // requested_reviewers: [],
  //   html_url
  //   login

  let descriptionTxt = "";

  // PR State.
  descriptionTxt += "state: " + CONTEXT_GITHUB.event.pull_request.state + "\r\n";

  // Date.
  // const date = new Date(Date.parse(CONTEXT_GITHUB.event.pull_request.created_at));
  const date = DateTime.fromISO(CONTEXT_GITHUB.event.pull_request.created_at); // DATETIME_SHORT  .toLocaleString(DateTime.DATETIME_SHORT)
  descriptionTxt += "created: " + date.toLocaleString(DateTime.DATETIME_SHORT) + "\r\n";

  // Mergable.
  descriptionTxt += "mergeable: " + CONTEXT_GITHUB.event.pull_request.mergeable + "\r\n";
  descriptionTxt += "mergeable_state: " + CONTEXT_GITHUB.event.pull_request.mergeable_state + "\r\n";
  descriptionTxt += "rebaseable: " + CONTEXT_GITHUB.event.pull_request.rebaseable + "\r\n";

  // Commits.
  descriptionTxt += "commits: " + CONTEXT_GITHUB.event.pull_request.commits + "\r\n";

  // Comments.
  descriptionTxt += "comments: " + CONTEXT_GITHUB.event.pull_request.comments + "\r\n";

  // Review Comments.
  descriptionTxt += "review_comments: " + CONTEXT_GITHUB.event.pull_request.review_comments + "\r\n";

  CONTEXT_GITHUB.event.pull_request.requested_reviewers.forEach((el, i) => {
    descriptionTxt += "reviewer(" + i + "): [" + el.login + "](" + el.html_url + ")\r\n";
  });





  payload = buildPayload(descriptionTxt);
  console.log(payload);

  core.setOutput('slack_payload', JSON.stringify(payload));
  core.setOutput('pr_description', body);
  core.setOutput('pr_description_data', data);
  core.setOutput('slack_ts', msg_id);
  // }
} catch (error) {
  core.setFailed(error.message);
}



// else {
//   console.log("Sorry, I don't know what to do.");
// }



// try {
//   const myOutput = 'Hello from JavaScript!';
//   core.setOutput('myOutput', myOutput);
// } catch (error) {
//   core.setFailed(error.message);
// }


function buildPayload(statusMsg = "") {

  const CONTEXT_GITHUB = JSON.parse(process.env.CONTEXT_GITHUB);

  let payload = {};
  payload.blocks = [];

  // Title.
  let titleBlock = {};
  titleBlock.type = "section";
  titleBlock.text = {};
  titleBlock.text.type = "plain_text";
  titleBlock.text.emoji = true;
  let t = "";
  if (CONTEXT_GITHUB.event.pull_request.draft) {
    t += "draft ";
  }
  t += "PR #" + CONTEXT_GITHUB.event.number;
  t += " | " + CONTEXT_GITHUB.event.pull_request.title;

  titleBlock.text.text = t;

  // Divider.
  let divBlock = {};
  divBlock.type = "divider";

  // Current state.
  let statusBlock = {};
  statusBlock.type = "section";
  statusBlock.text = {};
  statusBlock.text.type = "mrkdwn";
  statusBlock.text.text = statusMsg;

  // Action w/ link.
  let actionBlock = {};
  actionBlock.type = "actions";
  actionBlock.elements = [];

  let actionElement = {};
  actionElement.type = 'button';
  actionElement.text = {
    type: "plain_text",
    text: "Goto PR",
    emoji: true
  };
  actionElement.style = "primary";
  actionElement.url = CONTEXT_GITHUB.event.pull_request.html_url;

  actionBlock.elements.push(actionElement);

  // Put it all together.
  payload.blocks.push(titleBlock);
  payload.blocks.push(divBlock);
  payload.blocks.push(statusBlock);
  payload.blocks.push(actionBlock);

  return payload;
}
