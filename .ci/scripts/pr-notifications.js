// Provide these outputs.
// body_footer
// slack payload

const core = require('@actions/core');



try {
  console.log(process.env);




  const CONTEXT_GITHUB = JSON.parse(process.env.CONTEXT_GITHUB);

  // Determine action
  // GITHUB_EVENT_NAME
  // const action = CONTEXT_GITHUB.action;
  // console.log(action);

  // Opening a PR.
  // if (process.env.GITHUB_EVENT_NAME == "pull_request" && process.env.GITHUB_EVENT_ACTION == "opened") {
    console.log(CONTEXT_GITHUB);
    let current_description = CONTEXT_GITHUB.event.pull_request.body ?? "";
    console.log(current_description);
    let body = "";
    let data = "";

    if (current_description) {
      // MSG_SEPERATOR.
      console.log(process.env.MSG_SEPERATOR);
      console.log(current_description.split(process.env.MSG_SEPERATOR));

      let bodyObj = current_description.split(process.env.MSG_SEPERATOR);
      body = bodyObj[0];
      data = bodyObj[1] ?? "";
    }

    payload = buildPayload("Hello World");
    console.log(payload);


    core.setOutput('slack_payload', JSON.stringify(payload));
    core.setOutput('pr_description', body);
    core.setOutput('pr_description_data', data);
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

  let payload = {};
  payload.blocks = [];

  // Title.
  let titleBlock = {};
  titleBlock.type = "section";
  titleBlock.text = {};
  titleBlock.text.type = "mrkdwn";
  let t = "";
  if (CONTEXT_GITHUB.event.pull_request.draft) {
    t += "draft ";
  }
  t += "PR #" + CONTEXT_GITHUB.event.number;
  t += " | " + CONTEXT_GITHUB.event.pull_request.title;


  titleBlock.text.text = "";

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

  return payload;
}
