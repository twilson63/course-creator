# Test End-to-End

Time to see everything work together! We'll use the transcript simulator to trigger your webhook.

## Set Up the Simulator

1. Open the [Call Transcript Simulator](https://call-transcript-simulator.onrender.com)
2. Find the **Webhook URL** field
3. Paste your webhook URL from the previous step

## Generate a New Transcript

1. Select a call type (e.g., "Sales Call" or "Marketing")
2. Choose a duration (1 minute is fine for testing)
3. Click **Generate Transcript**

The simulator will:
- Create a mock transcript
- Send the transcript ID to your webhook
- Your workflow will receive and process it

## Watch It Happen

Back in ScoutOS, open your workflow and look at the **Logs** or **Runs** section.

You should see:

1. **Input received**: The webhook payload with the transcript ID
2. **Agent executing**: Your agent fetching and processing
3. **Output**: The final summary

## Verify the Output

Click on the run to see the details. You should see:

- The transcript ID that was received
- The agent's code execution (fetching the transcript)
- The complete summary with participants, insights, and action items

## Try Another One

Generate a different type of transcript (maybe a support call) and watch it process automatically.

## Troubleshooting

**Webhook not triggering:**
- Verify the URL is correct in the simulator
- Check that your workflow is published
- Look at the webhook logs for errors

**Agent timing out:**
- The transcript simulator might be slow on first request
- Try generating another transcript

**Getting wrong data:**
- Check that your webhook's input field is set to "message"
- Verify the JSON structure matches what your agent expects
